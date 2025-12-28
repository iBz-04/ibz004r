import { presetForms } from "@julr/unocss-preset-forms";
import {
  defineConfig,
  presetIcons,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [presetWind({ dark: "class" }), presetIcons(), presetForms()],
	transformers: [transformerDirectives(), transformerVariantGroup()],
	theme: {
		colors: {
			brown: {
				50: "#fdf8f6",
				100: "#f2e8e5",
				200: "#eaddd7",
				300: "#e0cec7",
				400: "#d2bab0",
				500: "#bfa094",
				600: "#a18072",
				700: "#81665a",
				800: "#665248",
				900: "#54433a",
				950: "#2c221e",
			},
		},
	},
	safelist: ["i-lucide-youtube", "text-red-500"],
});
