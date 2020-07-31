import { Op } from 'sequelize';

const operation = (sequelize, DataTypes) => {
    const Operation = sequelize.define('operation', {
      id: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
        primaryKey: true
      },
      operation_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      query: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      result_path: {
        type: DataTypes.STRING,
        allowNull: true
      },
      volume_path: {
        type: DataTypes.STRING,
        allowNull: true
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true
      },
    });

    Operation.init = async function(id, name, query){
        await Operation.create({
          id: id,
          operation_name: name,
          query: query,
          status: 'Pending',
          start_time: Date.now()
        }).then(() => {
            console.log("CREATED")
        }).catch(err => {
            console.log(`ERROR while creating the operation ${err}`);
            return;
        });
    }

    Operation.end = async function(id, status, result_path = null, volume_path = null){
      await Operation.update({
        status: status,
        end_time: Date.now(),
        result_path: result_path,
        volume_path: volume_path
       },
       {
       where: {
         id: id
       }
     });
    }

    Operation.queryExists = async function(query){
      return Operation.count({
        where: { 
          query: query,
          status: {
            [Op.not]: 'Failed'
          }
        } 
      }).then(count => {
        if (count > 0) {
          return true;
        }
        return false;
      }).catch(err => {
        console.log(`ERROR while getting operation by query: ${err}`);
        return false;
      });
    }

    return Operation;
  };

  export default operation;