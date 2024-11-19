import { CustomError } from "@/middleware/CustomError";
import { CustomNextRequest } from "@/types";
import { validateWithSchema } from "@/utils/validations/validations";
import { newWorkspaceSchema } from "@/utils/validations/workspace";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const validateNewWorkSpace = async (req: CustomNextRequest,res:NextResponse) => {
  try {
    const data = await req.json();
    const schema = newWorkspaceSchema();
    schema.parse(data);

    const response = NextResponse.next();
    req.context = req.context || {};
    req.context.text = "meh"; // Add context to the request
    response.cookies.set("survey", JSON.stringify({ test: "meh" }), {
      path: "/",
    });
    response.headers.set("User-Id", res.headers.get("User-Id")!);
    return response;
  } catch (error) {
    throw new CustomError(
      "Error Validating new Workspace",
      400,
      "workspace",
      true,
      "",
      validateWithSchema(error)
    );
  }
};

export async function checkWorkspaceExists(req: CustomNextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const workspaceId = searchParams.get("workspaceId"); // Get workspaceId from query params

    if (!workspaceId) {
      return NextResponse.json(
        { message: "Workspace ID is required" },
        { status: 400 }
      );
    }

    // Check if the workspace exists in the database
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return NextResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    req.context = req.context || {};
    req.context.workspace = workspace;

    return NextResponse.next();
  } catch (error) {
    throw error;
  }
}
// export const checkGroupMembershipFowWorkspace = async (
//   req: Request<
//     { endingId: string; surveyId: string; workspaceId: string },
//     {},
//     {
//       isActive: boolean;
//       title: string;
//       targetWorkspaceId: string;
//       workspaceId: string;
//     }
//   >,
//   res: Response<
//     {},
//     {
//       userGroupIds?: number[];
//       userId: string;
//       groupMembers?: UserGroupModel[];
//       workspaceOwner?: string;
//     }
//   >,
//   next: NextFunction
// ) => {
//   try {
//     const { userGroupIds, workspaceOwner } = res.locals;
//     const { workspaceId } = req.body;
//     const { workspaceId: fromParams } = req.params;
//     const finalWorkspaceId = workspaceId || fromParams;
//     const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";

//     const workspace = await prisma.workspace.findFirst({
//       where: { id: finalWorkspaceId },
//     });

//     if (!workspace) {
//       return next(
//         new CustomError(
//           getTranslation(currentLang, "workspaceNotFound"),
//           404,
//           true,
//           "workspaceNotFound"
//         )
//       );
//     }
//     if (!userGroupIds || userGroupIds.length === 0) {
//       return next(
//         new CustomError(
//           getTranslation(currentLang, "notAMemberOfAnyGroup"),
//           403,
//           true,
//           "notAMemberOfAnyGroup"
//         )
//       );
//     }

//     const hasAccess = await WorkspaceGroup.findOne({
//       where: { workspaceId: workspace.id, groupId: userGroupIds },
//     });

//     if (!hasAccess) {
//       return next(
//         new CustomError(
//           getTranslation(currentLang, "notAMemberOfGroup"),
//           403,
//           true,
//           "accessDeniedToWorkspace"
//         )
//       );
//     }

//     const userGroup = await Group.findOne({
//       where: { maker: workspaceOwner },
//     });

//     const groupMembers = await UserGroup.findAll({
//       where: { groupId: userGroup?.id },
//     });

//     res.locals.userGroupIds = userGroupIds;
//     res.locals.groupMembers = groupMembers.map((member) =>
//       member.get({ plain: true })
//     );

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// export const checkWorkspaceTitle = async (
//   req: Request<{ workspaceId: string }, {}, { title: string }>,
//   res: Response<{}, { userId: string }>,
//   next: NextFunction
// ) => {
//   try {
//     const currentLang = (req.headers["accept-language"] as "en" | "de") ?? "en";

//     const { title } = req.body;
//     const { workspaceId } = req.params;

//     newWorkspaceSchema().parse({ title });

//     next();
//   } catch (error) {
//     const { headers } = req;
//     const currentLang = headers["accept-language"] as "en" | "de";
//     if (error instanceof ZodError) {
//       console.log(validateWithSchema(error, currentLang));
//       return next(
//         new CustomError(
//           "Validation Error",
//           400,
//           true,
//           "`validationError`",
//           "",
//           validateWithSchema(error, currentLang)
//         )
//       );
//     }
//     next(error);
//   }
// };
