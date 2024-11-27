import { NextResponse,NextRequest } from "next/server";
import { workspaceBuilderRoutes } from "./workspace/handler";
import { surveyBuilderRoutes } from "./survey/handler";
import { groupBuilderRoutes } from "./group/handler";

export const handleSurveyBuilderRoutes = async (req: NextRequest) => {
  try {
    const pathName = req.nextUrl.pathname;

    if (pathName.startsWith("/api/survey_builder/survey")) {
      return await surveyBuilderRoutes(req);
    }

    if (pathName.startsWith("/api/survey_builder/workspace")) {
      return await workspaceBuilderRoutes(req);
    }
    if (pathName.startsWith("/api/survey_builder/group")) {
      return await groupBuilderRoutes(req);
    }

    return NextResponse.json(
      { message: "Survey Builder Route Not found" },
      { status: 404 }
    );
  } catch (error) {
    throw error;
  }
};
