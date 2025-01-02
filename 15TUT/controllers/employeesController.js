const Employee = require('../model/Employee')

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employee found' })
    res.json(employees)
}

const createNewEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.firstname) {
        return res.status(400).json({ 'message': 'Firstname and Lastnames are required ' })
    }
    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err)
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': "ID parameter required" })
    }
    const employee = await Employee.findOne({ id_: req.body.id }).exec()
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required' })

    const employee = await Employee.findOne({ id_: req.body.id }).exec()

    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id} ` });
    }
    const result = await employee.deleteOne({ id_: req.body.id })
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (req?.params?.id) return res.status(400).json({ 'message' : 'Employee ID required'})

        const employee = await Employee.findOne({id_ : req.params.id}).exec(); 
        if (!employee) {
            return res.status(204).json({ "message": `No employee matches ID ${req.params.id} ` });
        }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
} 