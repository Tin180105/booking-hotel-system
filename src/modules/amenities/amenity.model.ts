import sql from "mssql";
import { getConnection } from "../../config/database";

export interface Amenity {
    id: number;
    name: string;
    icon_code: string | null;
}

export const AmenityModel = {

    // GET ALL
    async getAll() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                id,
                name,
                icon_code
            FROM amenities
            ORDER BY id DESC
        `);

        return result.recordset;
    },

    // GET ALL - VIEW
    async getOverview() {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT
                amenity_id,
                amenity_name,
                icon_code,
                total_hotels
            FROM vw_AmenityOverview
            ORDER BY amenity_id DESC
        `);

        return result.recordset;
    },

    // GET BY ID
    async getById(id: number) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.BigInt, id)
            .query(`
                SELECT
                    id,
                    name,
                    icon_code
                FROM amenities
                WHERE id = @id
            `);

        return result.recordset[0];
    },

    // CREATE
    async create(
        name: string,
        iconCode: string | null
    ) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("name", sql.NVarChar(100), name)
            .input("icon_code", sql.VarChar(50), iconCode)
            .query(`
                INSERT INTO amenities (
                    name,
                    icon_code
                )
                OUTPUT
                    INSERTED.id,
                    INSERTED.name,
                    INSERTED.icon_code
                VALUES (
                    @name,
                    @icon_code
                )
            `);

        return result.recordset[0];
    },

    // UPDATE
    async update(
        id: number,
        name: string,
        iconCode: string | null
    ) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.BigInt, id)
            .input("name", sql.NVarChar(100), name)
            .input("icon_code", sql.VarChar(50), iconCode)
            .query(`
                UPDATE amenities
                SET
                    name = @name,
                    icon_code = @icon_code
                OUTPUT
                    INSERTED.id,
                    INSERTED.name,
                    INSERTED.icon_code
                WHERE id = @id
            `);

        return result.recordset[0];
    },

    // DELETE
    async delete(id: number) {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id", sql.BigInt, id)
            .query(`
                DELETE FROM amenities
                WHERE id = @id
            `);

        return result.rowsAffected[0];
    }
};