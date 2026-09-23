export const palette = {
  board: "#2E4436",
  boardDeep: "#233529",
  paper: "#F2E4C4",
  paperEdge: "#D9C393",
  paperShadow: "rgba(20,26,20,0.45)",
  ink: "#2B2118",
  inkSoft: "#6B5842",
  sarvgun: "#E2622F",
  sarvgunSoft: "#F8DAC4",
  elahi: "#6E5FCB",
  elahiSoft: "#DFDAF5",
  gold: "#E0A53C",
  tape: "rgba(252,239,199,0.85)",
  cream: "#FBF3DD",
  teacher: "#8A6A2A",
  teacherSoft: "#EFE7CF",
};

export const fonts = {
  display: "'Baloo 2', 'Segoe UI', sans-serif",
  body: "'Nunito Sans', system-ui, sans-serif",
  hand: "'Caveat', cursive",
};

export const speakerColor = (speaker: string) => {
  switch (speaker) {
    case "sarvgun":
      return { fg: palette.sarvgun, bg: palette.sarvgunSoft };
    case "elahi":
      return { fg: palette.elahi, bg: palette.elahiSoft };
    case "teacher":
      return { fg: palette.teacher, bg: palette.teacherSoft };
    default:
      return { fg: palette.inkSoft, bg: "transparent" };
  }
};

export const speakerName = (speaker: string) => {
  switch (speaker) {
    case "sarvgun":
      return "Sarvgun";
    case "elahi":
      return "Elahi";
    case "teacher":
      return "Teacher";
    default:
      return "";
  }
};
