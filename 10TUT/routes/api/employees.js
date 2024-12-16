const express = require('express');
const router = express.Router(); //defining our router 
const path = require('path');
const employeesController = require('../../controllers/employeesController')
const verifyJWT = require('../../middleware/verifyJWT')

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployees)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee)
    
    router.route('/:id')
    .get(employeesController.getEmployee);


module.exports = router 