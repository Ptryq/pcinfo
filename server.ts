import Elysia, { t } from "elysia";
import { Sequelize, DataTypes } from "sequelize";

const db = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});

const Device = db.define('Device', {
    host: {
        type: DataTypes.STRING
    },
    sn: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    cpu: {
        type: DataTypes.STRING
    },
    ram: {
        type: DataTypes.STRING
    },
    producent: {
        type: DataTypes.STRING
    },
    model: {
        type: DataTypes.STRING,
    },
    family: {
        type: DataTypes.STRING,
    },
    disk: {
        type: DataTypes.STRING,
    },
    os_version: {
        type: DataTypes.STRING,
    },
    user: {
        type: DataTypes.STRING,
    }
});

await db.sync({
    force: true // this clears the whole DB
});

const server = new Elysia().post('/device', async ({ body: { data } }) => {
    try {
        // Używamy upsert do aktualizacji lub utworzenia nowego rekordu
        await Device.upsert({ ...data });

        return {
            success: true
        };
    } catch (error) {
        console.error("Error while upserting device:", error);
        return {
            success: false,
            message: "Error while saving device"
        };
    }
}, {
    body: t.Object({
        data: t.Object({
            host: t.String(),
            sn: t.String(),
            cpu: t.String(),
            ram: t.String(),
            producent: t.String(),
            model: t.String(),
            family: t.String(),
            disk: t.String(),
            os_version: t.String(),
            user: t.String(),
        })
    })
});

server.listen(2137, () => {
    console.log('Server is listening on port 2137');
});
