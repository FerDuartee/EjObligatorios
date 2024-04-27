import UserModel from '../models/user.model.js';

export default class UserRepositoryDao {
  getUserByEmail = async (email) => {
    return await UserModel.findOne({ email });
  };
}


