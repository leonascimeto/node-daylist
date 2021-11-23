const TaskModel = require('../model/TaskModel');
const { isPast } = require('date-fns')

const TaskValidation = async (req, res, next) => {
  const { macaddress, type, title, when } = req.body;

  if(!macaddress) return res.status(400).json({error: 'macadress é obrigatório'});

  else if(!type) return res.status(400).json({error: 'tipo é obrigatório'});

  else if(!title) return res.status(400).json({error: 'titulo é obrigatório'});

  else if(!when) return res.status(400).json({error: 'Data e hora é obrigatório'});

  else if(isPast(new Date(when))) return res.status(400).json({error: 'escolha uma data e hora futura'}); 
  
  else{
    let exists;

    if(req.params.id){
      exists = await TaskModel
    .findOne({
      '_id' : {'$ne' : req.params.id},
      'when' : {'$eq' : new Date(when)},
      'macaddress' : {'$in' : macaddress}
    });
    }else{
      exists = await TaskModel
      .findOne({
        'when' : {'$eq' : new Date(when)},
        'macaddress' : {'$in' : macaddress}
      });
    }

    if(exists) return res.status(400).json({error: 'já existe uma tarefa neste mesmo dia e horário'});
    next();
  } 
    
}

module.exports = TaskValidation;