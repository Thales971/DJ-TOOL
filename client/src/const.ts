export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

const soundUrl = (filename: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/sounds/${filename}`;

export const minecraftSounds = [
  {
    name: "DOG BARK!",
    url: soundUrl("minecraft-dog-bark.mp3"),
    color: "#ff00ff",
  },
  {
    name: "BOOM!",
    url: soundUrl("tnt-explosion.mp3"),
    color: "#ff0033",
  },
  {
    name: "SPLASH!",
    url: soundUrl("Minecraft-Old-Water-Splash-Sound-Effect.mp3"),
    color: "#00ffff",
  },
  {
    name: "CRUNCH!",
    url: soundUrl("snow-minecraft-sound-fx.wav"),
    color: "#ffff00",
  },
  {
    name: "DAMAGE!",
    url: soundUrl("damage-minecraft-sound-fx.wav"),
    color: "#f97316",
  },
  {
    name: "FIRE!",
    url: soundUrl("minecraft---fire-made-with-Voicemod.mp3"),
    color: "#fb7185",
  },
  {
    name: "MEOW!",
    url: soundUrl("meow-made-with-Voicemod.mp3"),
    color: "#a855f7",
  },
  {
    name: "LEVEL UP!",
    url: soundUrl("minecraft-_-level-up-made-with-Voicemod.mp3"),
    color: "#10b981",
  },
  {
    name: "MENU CLICK!",
    url: soundUrl("minecraft---menu-click-made-with-Voicemod.mp3"),
    color: "#3b82f6",
  },
  {
    name: "METAL!",
    url: soundUrl("minecraft---metal-1-made-with-Voicemod.mp3"),
    color: "#64748b",
  },
  {
    name: "POTION!",
    url: soundUrl("minecraft-potion-drinking-made-with-Voicemod.mp3"),
    color: "#8b5cf6",
  },
  {
    name: "NOM NOM!",
    url: soundUrl("nom-nom-nom_gPJiWn4.mp3"),
    color: "#ea580c",
  },
  {
    name: "SNOW 2!",
    url: soundUrl("snow-2-minecraft-sound-fx.wav"),
    color: "#84cc16",
  },
  {
    name: "SNOW 3!",
    url: soundUrl("snow-3-minecraft-sound-fx.wav"),
    color: "#65a30d",
  },
  {
    name: "SNOW 4!",
    url: soundUrl("snow-4-minecraft-sound-fx.wav"),
    color: "#4d7c0f",
  },
  {
    name: "IGNITE!",
    url: soundUrl("ignite---fire-made-with-Voicemod.mp3"),
    color: "#dc2626",
  },
];
