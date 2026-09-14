Sửa booking.model.ts phần (updateStatus) tránh bị lost update:

    async updateStatus(id: number, status: string, expectedOldStatus?: string) {
        const pool = await getConnection();
        const request = pool.request()
            .input('id', sql.BigInt, id)
            .input('status', sql.VarChar, status);

        let whereClause = 'WHERE id = @id';
        if (expectedOldStatus) {
            request.input('old_status', sql.VarChar, expectedOldStatus);
            whereClause += ' AND status = @old_status';
        }

        const result = await pool.request()
            .input('id', sql.BigInt, id)
            .input('status', sql.VarChar, status)
            .input('old_status', sql.VarChar, expectedOldStatus ?? null)
            .query(`
                UPDATE bookings
                SET status = @status, updated_at = GETDATE()
                OUTPUT INSERTED.id, INSERTED.status, INSERTED.updated_at
                WHERE id = @id
                AND (@old_status IS NULL OR status = @old_status)
            `);

        return result.recordset[0] || null;
    }

Sửa booking.service.ts phần (updateStatus) tránh bị lost update:

    async updateStatus(id: number, status: string) {
        if (!Number.isInteger(id) || id <= 0) throw new Error('Booking ID không hợp lệ');
        if (!ALLOWED_STATUS.includes(status)) throw new Error(`Trạng thái không hợp lệ...`);

        const existing = await BookingModel.getById(id);
        if (!existing) throw new Error('Không tìm thấy booking');

        await new Promise((resolve) => setTimeout(resolve, 6000)); // vẫn giữ delay để demo lại

        const updated = await BookingModel.updateStatus(id, status, existing.status);

        if (!updated) {
            // 0 dòng bị ảnh hưởng => status đã bị người khác đổi trong lúc mình đang xử lý
            throw new Error(
                `Booking đã bị người khác cập nhật trạng thái (không còn là "${existing.status}"). Vui lòng tải lại trang.`
            );
        }

        return updated;
    }