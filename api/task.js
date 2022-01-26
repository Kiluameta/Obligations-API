const moment =  require('moment')
const { rows } = require('pg/lib/defaults')

module.exports = app => {
    const getTasks = (req, res) => {
        const date = req.query.date ? req.query.date 
            : moment().endOf('day').toDate()

        app.db('tasks')
            .where({ userId: req.user.id })
            .where('estimate', '<=', date)
            .orderBy('estimate')
            .then(tasks => res.json(tasks))
            .catch(err => err.status(400).json(err))
    }

    const save = (req, res) => {
        if(!req.body.desc.trim()){
            return res.status(400).send('Informe a descrição')
        }

        req.body.userId = req.user.id

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('tasks')
            .where({id: req.params.id, userId: req.user.id})
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0){
                    res.status(204).send()
                } else {
                    const msg = `Não foi possível encontrar a tarefa de número: ${req.params.id} !`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const updateTaskDone = (req, res, done) => {
        app.db('tasks')
            .where({id: req.params.id, userId: req.user.id})
            .update({done})
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({id: req.params.id, userId: req.user.id})
            .first()
            .then(task => {
                if (!task){
                    const msg = `Não foi possível encontrar a tarefa de número: ${req.params.id} !`
                    res.status(400).send(msg)
                }

                const done = task.done ? null : new Date() 
                updateTaskDone(req, res, done)
            })  
            .catch(err => res.status(400).json(err)) 
    }

    return { getTasks, save, remove, toggleTask }
    
}