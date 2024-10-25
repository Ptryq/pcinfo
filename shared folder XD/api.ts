import { Elysia } from 'elysia';
import { Sequelize, DataTypes } from 'sequelize';

const app = new Elysia();

const sequelize = new Sequelize('defro2', 'patryk', '123', {
    host: 'localhost',
    dialect: 'postgres',
  });


  const getAllComputers = async (tableName: string): Promise<object[]> => {
    const Model = sequelize.define(tableName, {}, {
      tableName: tableName,
      timestamps: false,
    });
  
    const records = await Model.findAll({
      attributes: ['id', 'inuse', 'host', 'sn', 'cpu', 'ram', 'producent', 'model', 'family', 'disk', 'os_version', 'user'],
    });
  
    return records.map(record => record.toJSON());
  };

  const getAllPhones = async (tableName: string): Promise<object[]> => {
    const Model = sequelize.define(tableName, {}, {
      tableName: tableName,
      timestamps: false,
    });
  
    const records = await Model.findAll({
      attributes: ['id', 'inuse', 'imei', 'model', 'user', 'email'],
    });
  
    return records.map(record => record.toJSON());
  };

const getProtocols = async (tableName: string): Promise<object[]> => {
    const Model = sequelize.define(tableName, {}, {
      tableName: tableName,
      timestamps: false,
    });
  
    const records = await Model.findAll({
      attributes: ['id', 'inuse', 'host', 'sn', 'cpu', 'ram', 'producent', 'model', 'family', 'disk', 'os_version', 'user'],
    });
  
    return records.map(record => record.toJSON());
  };


      

app.get('/Laptop', async () => await getAllComputers('Computers'));


// app.get('/Phone', () => );


// app.get('/protocol', () => );


// app.get('/instock', () => );


// app.get('/outofstock', () => );



app.listen(2137, () => {
  console.log('Server running on http://localhost:2137');
});