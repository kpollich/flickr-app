import React, { createContext, useReducer, useContext, Dispatch } from "react";

interface LightboxState {
  isOpen: boolean;
  currentPhotoIndex: number;
}

type LightboxActionType = "setPhoto" | "next" | "previous" | "close";

interface LightboxAction {
  type: LightboxActionType;
  payload?: any;
}

const lightboxReducer: React.Reducer<LightboxState, LightboxAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "setPhoto":
      return {
        ...state,
        isOpen: true,
        currentPhotoIndex: action.payload.index
      };

    case "next":
      return { ...state, currentPhotoIndex: state.currentPhotoIndex + 1 };

    case "previous":
      return { ...state, currentPhotoIndex: state.currentPhotoIndex - 1 };

    case "close":
      return { ...state, isOpen: false };

    default:
      throw new Error(`Unrecognized type ${action.type}`);
  }
};

interface LightboxContextValue extends LightboxState {
  dispatch: Dispatch<LightboxAction>;
}

const LightboxContext = createContext<LightboxContextValue | undefined>(
  undefined
);

export const LightboxContextProvider: React.FunctionComponent = ({
  children
}) => {
  const [state, dispatch] = useReducer(lightboxReducer, {
    isOpen: false,
    currentPhotoIndex: 0
  });

  return (
    <LightboxContext.Provider value={{ ...state, dispatch }}>
      {children}
    </LightboxContext.Provider>
  );
};

export function useLightboxContext(): LightboxContextValue {
  const context = useContext(LightboxContext);

  if (context === undefined) {
    throw new Error(
      "useLightboxContext must be called inside a LightboxContextProvider"
    );
  }

  return context;
}
