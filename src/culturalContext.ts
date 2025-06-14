const contextMap: Record<string, string> = {
  oppa: 'Used by females to address an older brother or close older male friend; often used in K-Pop fandom for male idols.',
  unni: 'Used by females to address an older sister or close older female friend.',
  hyung: 'Used by males to address an older brother or close older male friend.',
  sunbae: 'Refers to a senior in school or work; someone with more experience.',
  hoobae: 'Refers to a junior or someone with less experience in a school or workplace.',
  maknae: 'The youngest member in a group, especially in K-Pop bands.',
  chaebol: 'A large family-owned business conglomerate in South Korea.',
  hallyu: 'The Korean Wave; the global popularity of South Korean culture.',
  aegyo: 'Cute behavior considered endearing in Korean culture.',
  daebak: 'A slang expression meaning amazing or awesome.',
  jjang: 'A slang term meaning the best or awesome.',
};

export function getCulturalContext(text: string): string | undefined {
  const normalized = text.trim().toLowerCase();
  return contextMap[normalized];
}
