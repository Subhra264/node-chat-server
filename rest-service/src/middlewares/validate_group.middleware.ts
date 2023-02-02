import { Request, NextFunction, Response } from 'express';
import AuthenticatedRequest, {
  GroupValidatedRequest,
} from '../utils/interfaces/AuthenticatedRequest';
import Group, { GroupDocument } from '../models/Group.model';
import HttpErrors from '../errors/http-errors';
import convertToHttpErrorFrom from '../errors/errors_to_HttpError';

export default async function validateGroup(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { groupId } = req.params;
    const groups = user.groups;

    let isGroupIdValid = false;
    // TODO: Add a proper type for AuthenticatedUser.groups
    // For now, each group actually populated based on 'name' and 'image'
    groups?.forEach((group: any) => {
      if (JSON.stringify(group._id) === `"${groupId}"`) {
        isGroupIdValid = true;
      }
    });

    if (!isGroupIdValid) throw HttpErrors.Forbidden();

    const group: GroupDocument = await Group.findById(groupId).exec();
    (req as GroupValidatedRequest).validatedGroup = group;
    next();
  } catch (err) {
    err = convertToHttpErrorFrom(err);
    next(err);
  }
}
