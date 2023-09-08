"use server";

import School from "../models/school.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
export async function fetchCommunityDetails(id: string) {
  try {
    connectToDB();

    const communityDetails = await School.findOne({ id }).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
    ]);

    return communityDetails;
  } catch (error) {
    throw error;
  }
}
