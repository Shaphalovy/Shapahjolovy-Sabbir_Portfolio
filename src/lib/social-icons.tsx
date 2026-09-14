import {
  TbBrandGithub,
  TbBrandLinkedin,
  TbBrandX,
  TbBrandYoutube,
  TbBrandInstagram,
  TbBrandFacebook,
  TbBrandDribbble,
} from "react-icons/tb";
import { Mail, Globe, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

const ICON_MAP: Record<string, LucideIcon | IconType> = {
  github: TbBrandGithub,
  linkedin: TbBrandLinkedin,
  twitter: TbBrandX,
  x: TbBrandX,
  youtube: TbBrandYoutube,
  instagram: TbBrandInstagram,
  facebook: TbBrandFacebook,
  dribbble: TbBrandDribbble,
  mail: Mail,
  email: Mail,
  globe: Globe,
  website: Globe,
};

export const SOCIAL_ICON_OPTIONS = Object.keys(ICON_MAP);

export function getSocialIcon(key: string): LucideIcon | IconType {
  return ICON_MAP[key.toLowerCase()] ?? Globe;
}
