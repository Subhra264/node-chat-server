import HttpErrors from "../errors/http-errors";
import User from "../models/User.model";
import userSchema from "../utils/validate_schema/validate_user"
import bcrypt from "bcrypt";

export = {
    createAccount: async (req, res, next) => {

        try {
            // Validate the req.body
            const validatedUser = await userSchema.validateAsync(req.body);

            const doesExist = await User.findOne(validatedUser.email);

            if(doesExist) throw await HttpErrors.Conflict('User already exists!');

            // const salt = await bcrypt.genSalt();

        } catch(err) {
            if(err.isJoi) {
                console.log('Error validating User Schema:', err);
                err = await HttpErrors.BadRequest('Please fill all the fields properly!');
            }
            throw err;
        }
    }
}