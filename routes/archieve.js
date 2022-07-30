const express = require('express');
const router = express.Router();

const creatureController = require('../controllers/creatureController');
const sourceController = require('../controllers/sourceController');
const typeController = require('../controllers/typeController');
const creatureinstanceController = require('../controllers/creatureinstanceController');
const { route } = require('.');

//Creature Routes //

router.get('/', creatureController.index);

router.get('/creature/create', creatureController.creature_create_get);

router.post('/creature/create', creatureController.creature_create_post);

router.get('/creature/:id/delete', creatureController.creature_delete_get);

router.post('/creature/:id/delete', creatureController.creature_delete_post);

router.get('/creature/:id/update', creatureController.creature_update_get);

router.post('/creature/:id/update', creatureController.creature_update_post);

router.get('/creature/:id', creatureController.creature_detail);

router.get('/creatures', creatureController.creature_list);

//Source Routes //

router.get('/source/create', sourceController.source_create_get);

router.post('/source/create', sourceController.source_create_post);

router.get('/source/:id/delete', sourceController.source_delete_get);

router.post('/source/:id/delete', sourceController.source_delete_post);

router.get('/source/:id/update', sourceController.source_update_get);

router.post('/source/:id/update', sourceController.source_update_post);

router.get('/source/:id', sourceController.source_detail);

router.get('/sources', sourceController.source_list);

// Type Routes //

router.get('/type/create', typeController.type_create_get);

router.post('/type/create', typeController.type_create_post);

router.get('/type/:id/delete', typeController.type_delete_get);

router.post('/type/:id/delete', typeController.type_delete__post);

router.get('/type/:id/update', typeController.type_update_get);

router.post('/type/:id/update', typeController.type_update_post);

router.get('/type/:id', typeController.type_detail);

router.get('/types', typeController.type_list);

// CreatureInstance Routes //

router.get(
  '/creatureinstance/create',
  creatureinstanceController.creatureinstance_create_get
);

router.post(
  '/creatureinstance/create',
  creatureinstanceController.creatureinstance_create_post
);

router.get(
  '/creatureinstance/:id/delete',
  creatureinstanceController.creatureinstance_delete_get
);

router.post(
  '/creatureinstance/:id/delete',
  creatureinstanceController.creatureinstance_delete_post
);

router.get(
  '/creatureinstance/:id/update',
  creatureinstanceController.creatureinstance_update_get
);

router.post(
  '/cretureinstance/:id/update',
  creatureinstanceController.creatureinstance_update_post
);

router.get(
  '/creatureinstance/:id',
  creatureinstanceController.creatureinstance_detail
);

router.get(
  '/creatureinstances',
  creatureinstanceController.creatureinstance_list
);

module.exports = router;
