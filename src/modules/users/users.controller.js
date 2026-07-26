const usersService = require('./users.service');

async function getMe(req, res, next) {
  try {
    const user = await usersService.getUserById(req.user.id);
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const user = await usersService.updateProfile(req.user.id, req.body);
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    await usersService.changePassword(req.user.id, req.body);
    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const { page, limit, search, role } = req.query;
    const result = await usersService.listUsers({ page, limit, search, role });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.userId);
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await usersService.adminUpdateUser(req.params.userId, req.body);
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await usersService.deleteUser(req.params.userId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMe,
  updateMe,
  changePassword,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};
