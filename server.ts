import Elysia, {t} from "elysia";
import {Sequelize, DataTypes} from "sequelize";

const db = new Sequelize({
    dialect: 'sqlite',
storage: './db.sqlite'
})

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
    }
})

await db.sync({
    force: true // this clears whole DB
});

const server = new Elysia().post('/device', ({body: { data}}) => {
    Device.create({ ...data})

    return {
        success: true
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
    })
})
})

server.listen(3000, () => {
console.log('Server is listening on port 3000');

})