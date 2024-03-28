const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
} = require('../../controllers/userController');

router.route('/').get(getThoughts).post(createThought);

router.route('/:userId').get(getSingleThought);
router.route('/:userId').put(updateThought);
router.route('/:userId').delete(deleteThought);

module.exports = router;