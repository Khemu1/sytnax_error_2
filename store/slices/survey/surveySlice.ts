import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyModel, SurveyParticipantModel } from "@/types/survey";

interface CurrentSurveyState {
  surveys: SurveyModel[];
  currentSurvey: SurveyModel | null;
}

const initialState: CurrentSurveyState = {
  surveys: [],
  currentSurvey: null,
};

const currentSurveySlice = createSlice({
  name: "currentSurvey",
  initialState,
  reducers: {
    setCurrentSurvey: (state, action: PayloadAction<SurveyModel>) => {
      state.currentSurvey = action.payload;
    },
    clearCurrentSurvey: (state) => {
      state.currentSurvey = null;
    },
    setSurveys: (state, action: PayloadAction<SurveyModel[]>) => {
      state.surveys = action.payload;
    },
    addSurvey: (state, action: PayloadAction<SurveyModel>) => {
      state.surveys.push(action.payload);
    },

    duplicateSurvey: (state, action: PayloadAction<SurveyModel>) => {
      const sur = state.surveys[0];
      if (action.payload.workspaceId === sur.workspaceId) {
        state.surveys.push(action.payload);
      }
    },
    updateSurvey: (state, action: PayloadAction<SurveyModel>) => {
      const index = state.surveys.findIndex(
        (survey) => survey.id === action.payload.id
      );
      if (index !== -1) {
        state.surveys[index] = action.payload;
      }
      if (state.currentSurvey?.id === action.payload.id) {
        state.currentSurvey = action.payload;
      }
    },
    moveSurvey: (state, action: PayloadAction<string>) => {
      const modifedArray = state.surveys.filter((survey) => {
        return survey.id !== action.payload;
      });
      state.surveys = modifedArray;
      if (state.currentSurvey?.id === action.payload) {
        state.currentSurvey = null;
      }
    },

    deleteSurvey: (
      state,
      action: PayloadAction<{ workspaceId: string; surveyId: string }>
    ) => {
      const modifiedSurveys = state.surveys.filter(
        (survey) => survey.id !== action.payload.surveyId
      );
      if (state.currentSurvey?.id === action.payload.surveyId) {
        state.currentSurvey = null;
      }
      state.surveys = modifiedSurveys;
    },
    addMembersToSurveyFirstTime: (
      state,
      action: PayloadAction<{
        surveyId: string;
        members: SurveyParticipantModel[];
      }>
    ) => {
      if (!state.currentSurvey)
        throw new Error("No current survey to add members to");

      if (action.payload.surveyId === state.currentSurvey.id) {
        state.currentSurvey.participants = [...action.payload.members];
      }
    },
    addMembersToSurvey: (
      state,
      action: PayloadAction<{
        surveyId: string;
        members: SurveyParticipantModel[];
      }>
    ) => {
      if (action.payload.surveyId === state.currentSurvey?.id) {
        console.log(action.payload.members);
        if (!state.currentSurvey.participants)
          state.currentSurvey.participants = [];
        state.currentSurvey.participants = [
          ...state.currentSurvey.participants,
          ...action.payload.members,
        ];
      }
    },

    deleteAllMembers: (state, action: PayloadAction<{ surveyId: string }>) => {
      if (!state.currentSurvey)
        throw new Error("No current survey to delete all members from");
      if (action.payload.surveyId === state.currentSurvey?.id) {
        state.currentSurvey.participants = [];
      }
    },

    deleteMembers: (
      state,
      action: PayloadAction<{
        surveyId: string;
        members: SurveyParticipantModel[];
      }>
    ) => {
      if (!state.currentSurvey)
        throw new Error("No current survey to delete members from");

      if (action.payload.surveyId === state.currentSurvey.id) {
        if (!state.currentSurvey.participants) {
          state.currentSurvey.participants = [];
        }

        action.payload.members.forEach((member) => {
          state.currentSurvey!.participants =
            state.currentSurvey!.participants.filter(
              (participant) => participant.id !== member.id
            );
        });
      }
    },

    resetAttempts: (
      state,
      action: PayloadAction<{
        members: SurveyParticipantModel[];
        surveyId: string;
      }>
    ) => {
      if (!state.currentSurvey)
        throw new Error("No current survey to reset attempts");
      if (action.payload.surveyId === state.currentSurvey.id) {
        if (!state.currentSurvey.participants) {
          state.currentSurvey.participants = [];
        }

        action.payload.members.forEach((member) => {
          const participant = state.currentSurvey!.participants.find(
            (p) => p.id === member.id
          );
          if (participant) {
            participant.attempts = 1;
            participant.hadBeenSearched = false;
          }
        });
      }
    },

    resetAllMembersAttempts: (
      state,
      action: PayloadAction<{ surveyId: string }>
    ) => {
      if (!state.currentSurvey)
        throw new Error("No current survey to reset all attempts ");
      if (action.payload.surveyId === state.currentSurvey.id) {
        if (!state.currentSurvey.participants) {
          state.currentSurvey.participants = [];
        }

        state.currentSurvey.participants.forEach((member) => {
          member.attempts = 1;
          member.hadBeenSearched = false;
        });
      }
    },
  },
});

export const {
  setCurrentSurvey,
  clearCurrentSurvey,
  deleteAllMembers,
  deleteMembers,
  resetAttempts,
  resetAllMembersAttempts,
  setSurveys,
  deleteSurvey,
  addSurvey,
  updateSurvey,
  moveSurvey,
  addMembersToSurvey,
  duplicateSurvey,
  addMembersToSurveyFirstTime,
} = currentSurveySlice.actions;

export default currentSurveySlice.reducer;
