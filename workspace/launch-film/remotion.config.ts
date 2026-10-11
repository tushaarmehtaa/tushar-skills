import { Config } from "@remotion/cli/config";

// PNG frames and standard-range colour keep small UI text clean through X's re-encode (agentarcade lesson).
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p");
Config.setCrf(16);
Config.setStudioPort(3012);
