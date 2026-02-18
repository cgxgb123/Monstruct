export const toGif = (name: string): string => {
  const clean = name.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (clean.includes('-gmax')) return clean;

  // ===== MEGA EVOLUTIONS (SPECIAL CASES) =====
  if (clean === 'charizard-mega-x') return 'charizard-megax';
  if (clean === 'charizard-mega-y') return 'charizard-megay';
  if (clean === 'mewtwo-mega-x') return 'mewtwo-megax';
  if (clean === 'mewtwo-mega-y') return 'mewtwo-megay';
  if (clean === 'dragonite-mega') return 'dragonite-mega';
  if (clean === 'pikachu-rock-star') return 'pikachu-rockstar';
  if (clean === 'pikachu-hoenn-cap') return 'pikachu-hoenn-cap';

  if (clean.includes('-mega')) return clean;
  if (clean === 'pikachu-rock-star') return 'pikachu-rockstar';
  if (clean === 'pikachu-pop-star') return 'pikachu-popstar';
  if (clean === 'pikachu-belle') return 'pikachu-belle';
  if (clean === 'pikachu-phd') return 'pikachu-phd';
  if (clean === 'pikachu-libre') return 'pikachu-libre';
  if (clean === 'pikachu-cosplay') return 'pikachu-cosplay';
  if (clean === 'pikachu-original-cap') return 'pikachu-original';
  if (clean === 'pikachu-hoenn-cap') return 'pikachu-hoenn';
  if (clean === 'pikachu-sinnoh-cap') return 'pikachu-sinnoh';
  if (clean === 'pikachu-unova-cap') return 'pikachu-unova';
  if (clean === 'pikachu-kalos-cap') return 'pikachu-kalos';
  if (clean === 'pikachu-alola-cap') return 'pikachu-alola';
  if (clean === 'pikachu-partner-cap') return 'pikachu-partner';
  if (clean === 'pikachu-world-cap') return 'pikachu-world';
  if (clean === 'eevee-starter') return 'eevee-starter';
  if (clean === 'pikachu-starter') return 'pikachu-starter';
  // ===== FORCES OF NATURE (INCARNATE VS THERIAN) =====
  if (clean === 'tornadus-incarnate') return 'tornadus';
  if (clean === 'thundurus-incarnate') return 'thundurus';
  if (clean === 'landorus-incarnate') return 'landorus';
  if (clean === 'enamorus-incarnate') return 'enamorus';

  // therian forms keep the suffix
  if (clean === 'tornadus-therian') return 'tornadus-therian';
  if (clean === 'thundurus-therian') return 'thundurus-therian';
  if (clean === 'landorus-therian') return 'landorus-therian';
  if (clean === 'enamorus-therian') return 'enamorus-therian';

  // ===== TOXTRICITY FORMS =====
  if (clean === 'toxtricity-amped') return 'toxtricity';
  if (clean === 'toxtricity-low-key') return 'toxtricity-lowkey';

  // ===== DARMANITAN ZEN MODES =====
  if (clean === 'darmanitan-standard') return 'darmanitan';
  if (clean === 'darmanitan-zen') return 'darmanitan-zen';
  if (clean === 'darmanitan-galar-standard') return 'darmanitan-galar';
  if (clean === 'darmanitan-galar-zen') return 'darmanitan-galarzen';

  // ===== ROTOM FORMS =====
  if (clean === 'rotom-mow') return 'rotom-mow';
  if (clean === 'rotom-wash') return 'rotom-wash';
  if (clean === 'rotom-heat') return 'rotom-heat';
  if (clean === 'rotom-frost') return 'rotom-frost';
  if (clean === 'rotom-fan') return 'rotom-fan';

  // ===== DEOXYS FORMS =====
  if (clean === 'deoxys-normal') return 'deoxys';
  if (clean === 'deoxys-attack') return 'deoxys-attack';
  if (clean === 'deoxys-defense') return 'deoxys-defense';
  if (clean === 'deoxys-speed') return 'deoxys-speed';

  // ===== WORMADAM/BURMY FORMS =====
  if (clean === 'wormadam-plant') return 'wormadam';
  if (clean === 'wormadam-sandy') return 'wormadam-sandy';
  if (clean === 'wormadam-trash') return 'wormadam-trash';
  if (clean === 'burmy-plant') return 'burmy';
  if (clean === 'burmy-sandy') return 'burmy-sandy';
  if (clean === 'burmy-trash') return 'burmy-trash';

  // ===== SHELLOS/GASTRODON FORMS =====
  if (clean === 'shellos-west') return 'shellos';
  if (clean === 'shellos-east') return 'shellos-east';
  if (clean === 'gastrodon-west') return 'gastrodon';
  if (clean === 'gastrodon-east') return 'gastrodon-east';

  // ===== BASCULIN FORMS =====
  if (clean === 'basculin-red-striped') return 'basculin';
  if (clean === 'basculin-blue-striped') return 'basculin-bluestriped';
  if (clean === 'basculin-white-striped') return 'basculin-whitestriped';

  // ===== GIRATINA FORMS =====
  if (clean === 'giratina-altered') return 'giratina';
  if (clean === 'giratina-origin') return 'giratina-origin';

  // ===== SHAYMIN FORMS =====
  if (clean === 'shaymin-land') return 'shaymin';
  if (clean === 'shaymin-sky') return 'shaymin-sky';

  // ===== MELOETTA FORMS =====
  if (clean === 'meloetta-aria') return 'meloetta';
  if (clean === 'meloetta-pirouette') return 'meloetta-pirouette';

  // ===== KELDEO FORMS =====
  if (clean === 'keldeo-ordinary') return 'keldeo';
  if (clean === 'keldeo-resolute') return 'keldeo-resolute';

  // ===== AEGISLASH FORMS =====
  if (clean === 'aegislash-shield') return 'aegislash';
  if (clean === 'aegislash-blade') return 'aegislash-blade';

  // ===== PUMPKABOO/GOURGEIST SIZES =====
  if (clean === 'pumpkaboo-average') return 'pumpkaboo';
  if (clean === 'pumpkaboo-small') return 'pumpkaboo-small';
  if (clean === 'pumpkaboo-large') return 'pumpkaboo-large';
  if (clean === 'pumpkaboo-super') return 'pumpkaboo-super';
  if (clean === 'gourgeist-average') return 'gourgeist';
  if (clean === 'gourgeist-small') return 'gourgeist-small';
  if (clean === 'gourgeist-large') return 'gourgeist-large';
  if (clean === 'gourgeist-super') return 'gourgeist-super';

  // ===== XERNEAS FORMS =====
  if (clean === 'xerneas-active') return 'xerneas';
  if (clean === 'xerneas-neutral') return 'xerneas-neutral';

  // ===== HOOPA FORMS =====
  if (clean === 'hoopa-confined') return 'hoopa';
  if (clean === 'hoopa-unbound') return 'hoopa-unbound';

  // ===== ORICORIO FORMS =====
  if (clean === 'oricorio-baile') return 'oricorio';
  if (clean === 'oricorio-pom-pom') return 'oricorio-pompom';
  if (clean === 'oricorio-pau') return 'oricorio-pau';
  if (clean === 'oricorio-sensu') return 'oricorio-sensu';

  // ===== LYCANROC FORMS =====
  if (clean === 'lycanroc-midday') return 'lycanroc';
  if (clean === 'lycanroc-midnight') return 'lycanroc-midnight';
  if (clean === 'lycanroc-dusk') return 'lycanroc-dusk';

  // ===== WISHIWASHI FORMS =====
  if (clean === 'wishiwashi-solo') return 'wishiwashi';
  if (clean === 'wishiwashi-school') return 'wishiwashi-school';

  // ===== MINIOR FORMS =====
  if (clean === 'minior-red-meteor') return 'minior-meteor';
  if (clean === 'minior-orange-meteor') return 'minior-meteor';
  if (clean === 'minior-yellow-meteor') return 'minior-meteor';
  if (clean === 'minior-green-meteor') return 'minior-meteor';
  if (clean === 'minior-blue-meteor') return 'minior-meteor';
  if (clean === 'minior-indigo-meteor') return 'minior-meteor';
  if (clean === 'minior-violet-meteor') return 'minior-meteor';
  if (clean === 'minior-red') return 'minior';
  if (clean === 'minior-orange') return 'minior-orange';
  if (clean === 'minior-yellow') return 'minior-yellow';
  if (clean === 'minior-green') return 'minior-green';
  if (clean === 'minior-blue') return 'minior-blue';
  if (clean === 'minior-indigo') return 'minior-indigo';
  if (clean === 'minior-violet') return 'minior-violet';

  // ===== MIMIKYU FORMS =====
  if (clean === 'mimikyu-disguised') return 'mimikyu';
  if (clean === 'mimikyu-busted') return 'mimikyu-busted';
  if (clean === 'mimikyu-totem-disguised') return 'mimikyu-totem';
  if (clean === 'mimikyu-busted-totem') return 'mimikyu-busted-totem';

  // ===== NECROZMA FORMS =====
  if (clean === 'necrozma-dusk-mane') return 'necrozma-duskmane';
  if (clean === 'necrozma-dawn-wings') return 'necrozma-dawnwings';
  if (clean === 'necrozma-ultra') return 'necrozma-ultra';

  // ===== CRAMORANT FORMS =====
  if (clean === 'cramorant-gulping') return 'cramorant-gulping';
  if (clean === 'cramorant-gorging') return 'cramorant-gorging';

  // ===== EISCUE FORMS =====
  if (clean === 'eiscue-ice') return 'eiscue';
  if (clean === 'eiscue-noice') return 'eiscue-noice';

  // ===== INDEEDEE FORMS =====
  if (clean === 'indeedee-male') return 'indeedee';
  if (clean === 'indeedee-female') return 'indeedee-f';

  // ===== MORPEKO FORMS =====
  if (clean === 'morpeko-full-belly') return 'morpeko';
  if (clean === 'morpeko-hangry') return 'morpeko-hangry';

  // ===== ZACIAN/ZAMAZENTA FORMS =====
  if (clean === 'zacian-hero') return 'zacian';
  if (clean === 'zacian-crowned') return 'zacian-crowned';
  if (clean === 'zamazenta-hero') return 'zamazenta';
  if (clean === 'zamazenta-crowned') return 'zamazenta-crowned';

  // ===== URSHIFU FORMS =====
  if (clean === 'urshifu-single-strike') return 'urshifu';
  if (clean === 'urshifu-rapid-strike') return 'urshifu-rapidstrike';

  // ===== CALYREX FORMS =====
  if (clean === 'calyrex-ice') return 'calyrex-ice';
  if (clean === 'calyrex-shadow') return 'calyrex-shadow';
  if (clean === 'calyrex-ice-rider') return 'calyrex-ice';
  if (clean === 'calyrex-shadow-rider') return 'calyrex-shadow';

  // ===== BASCULEGION FORMS =====
  if (clean === 'basculegion-male') return 'basculegion';
  if (clean === 'basculegion-female') return 'basculegion-f';

  // ===== OINKOLOGNE FORMS =====
  if (clean === 'oinkologne-male') return 'oinkologne';
  if (clean === 'oinkologne-female') return 'oinkologne-f';

  // ===== DUDUNSPARCE FORMS =====
  if (clean === 'dudunsparce-two-segment') return 'dudunsparce';
  if (clean === 'dudunsparce-three-segment') return 'dudunsparce-threesegment';

  // ===== MAUSHOLD FORMS =====
  if (clean === 'maushold-family-of-three') return 'maushold';
  if (clean === 'maushold-family-of-four') return 'maushold-four';

  // ===== SQUAWKABILLY FORMS =====
  if (clean === 'squawkabilly-green-plumage') return 'squawkabilly';
  if (clean === 'squawkabilly-blue-plumage') return 'squawkabilly-blue';
  if (clean === 'squawkabilly-yellow-plumage') return 'squawkabilly-yellow';
  if (clean === 'squawkabilly-white-plumage') return 'squawkabilly-white';

  // ===== TATSUGIRI FORMS =====
  if (clean === 'tatsugiri-curly') return 'tatsugiri';
  if (clean === 'tatsugiri-droopy') return 'tatsugiri-droopy';
  if (clean === 'tatsugiri-stretchy') return 'tatsugiri-stretchy';

  // ===== GIMMIGHOUL FORMS =====
  if (clean === 'gimmighoul-chest') return 'gimmighoul';
  if (clean === 'gimmighoul-roaming') return 'gimmighoul-roaming';

  // ===== POLTCHAGEIST/SINISTCHA FORMS =====
  if (clean === 'poltchageist-counterfeit') return 'poltchageist';
  if (clean === 'poltchageist-artisan') return 'poltchageist-artisan';
  if (clean === 'sinistcha-unremarkable') return 'sinistcha';
  if (clean === 'sinistcha-masterpiece') return 'sinistcha-masterpiece';

  // ===== PALDEAN TAUROS FORMS =====
  if (clean === 'tauros-paldea-combat') return 'tauros-paldeacombat';
  if (clean === 'tauros-paldea-blaze') return 'tauros-paldeablaze';
  if (clean === 'tauros-paldea-aqua') return 'tauros-paldeaaqua';

  // ===== TOTEM POKÉMON =====
  if (clean === 'togedemaru-totem') return 'togedemaru-totem';
  if (clean === 'raticate-alola-totem') return 'raticate-alola-totem';
  if (clean === 'gumshoos-totem') return 'gumshoos-totem';
  if (clean === 'vikavolt-totem') return 'vikavolt-totem';
  if (clean === 'lurantis-totem') return 'lurantis-totem';
  if (clean === 'salazzle-totem') return 'salazzle-totem';
  if (clean === 'araquanid-totem') return 'araquanid-totem';
  if (clean === 'marowak-totem') return 'marowak-totem';
  if (clean === 'marowak-alola-totem') return 'marowak-alola-totem';

  // ===== PALAFIN FORMS =====
  if (clean === 'palafin-zero') return 'palafin';
  if (clean === 'palafin-hero') return 'palafin-hero';

  // ===== CASTFORM FORMS =====
  if (clean === 'castform-normal') return 'castform';
  if (clean === 'castform-sunny') return 'castform-sunny';
  if (clean === 'castform-rainy') return 'castform-rainy';
  if (clean === 'castform-snowy') return 'castform-snowy';

  // ===== CHERRIM FORMS =====
  if (clean === 'cherrim-overcast') return 'cherrim';
  if (clean === 'cherrim-sunshine') return 'cherrim-sunshine';

  // ===== ARCEUS FORMS =====
  if (clean === 'arceus-normal') return 'arceus';

  // ===== SILVALLY FORMS =====
  if (clean === 'silvally-normal') return 'silvally';

  // ===== GENESECT FORMS =====
  if (clean === 'genesect-normal') return 'genesect';

  // ===== MAGEARNA FORMS =====
  if (clean === 'magearna-original') return 'magearna-original';

  // ===== ZARUDE FORMS =====
  if (clean === 'zarude-dada') return 'zarude-dada';

  // ===== ETERNATUS FORMS =====
  if (clean === 'eternatus-eternamax') return 'eternatus-eternamax';

  // ===== URSALUNA FORMS =====
  if (clean === 'ursaluna-bloodmoon') return 'ursaluna-bloodmoon';

  // ===== NIDORAN SPECIAL CASE =====
  if (clean === 'nidoran-f') return 'nidoranf';
  if (clean === 'nidoran-m') return 'nidoranm';

  // ===== PORYGON-Z SPECIAL CASE =====
  if (clean === 'porygon-z') return 'porygonz';

  // ===== FARFETCH'D SPECIAL CASE =====
  if (clean === 'farfetchd') return 'farfetchd';
  if (clean === 'farfetchd-galar') return 'farfetchd-galar';

  // ===== MR. MIME SPECIAL CASE =====
  if (clean === 'mr-mime') return 'mrmime';
  if (clean === 'mr-mime-galar') return 'mrmime-galar';
  if (clean === 'mr-rime') return 'mrrime';
  if (clean === 'mime-jr') return 'mimejr';

  // ===== TAPU SPECIAL CASE =====
  if (clean === 'tapu-koko') return 'tapukoko';
  if (clean === 'tapu-lele') return 'tapulele';
  if (clean === 'tapu-bulu') return 'tapubulu';
  if (clean === 'tapu-fini') return 'tapufini';

  // ===== JANGMO-O LINE SPECIAL CASE =====
  if (clean === 'jangmo-o') return 'jangmoo';
  if (clean === 'hakamo-o') return 'hakamoo';
  if (clean === 'kommo-o') return 'kommoo';
  if (clean === 'kommo-o-totem') return 'kommoo-totem';

  // ===== HO-OH SPECIAL CASE =====
  if (clean === 'ho-oh') return 'hooh';

  // ===== TYPE: NULL SPECIAL CASE =====
  if (clean === 'type-null') return 'typenull';

  // ===== FLABÉBÉ/FLOETTE/FLORGES COLOR FORMS =====
  if (clean === 'flabebe-red') return 'flabebe';
  if (clean === 'floette-red') return 'floette';
  if (clean === 'florges-red') return 'florges';

  // ===== FURFROU FORMS =====
  if (clean === 'furfrou-natural') return 'furfrou';

  // ===== DEERLING/SAWSBUCK FORMS =====
  if (clean === 'deerling-spring') return 'deerling';
  if (clean === 'sawsbuck-spring') return 'sawsbuck';

  // ===== PIKACHU COSPLAY/CAP FORMS =====
  if (clean === 'pikachu-pop-star') return 'pikachu-popstar';

  // ===== VIVILLON FORMS =====
  if (clean === 'vivillon-meadow') return 'vivillon';

  // ===== GRENINJA FORMS =====
  if (clean === 'greninja-ash') return 'greninja-ash';
  if (clean === 'greninja-battle-bond') return 'greninja';

  // ===== ZYGARDE FORMS =====
  if (clean === 'zygarde-50') return 'zygarde';
  if (clean === 'zygarde-10') return 'zygarde-10';
  if (clean === 'zygarde-complete') return 'zygarde-complete';

  // ===== PRIMAL/ORIGIN FORMS =====
  if (clean === 'kyogre-primal') return 'kyogre-primal';
  if (clean === 'groudon-primal') return 'groudon-primal';
  if (clean === 'dialga-origin') return 'dialga';
  if (clean === 'palkia-origin') return 'palkia';

  // ===== POLTEAGEIST/SINISTEA FORMS =====
  if (clean === 'sinistea-phony') return 'sinistea';
  if (clean === 'sinistea-antique') return 'sinistea-antique';
  if (clean === 'polteageist-phony') return 'polteageist';
  if (clean === 'polteageist-antique') return 'polteageist-antique';

  if (clean.includes('-alola')) return clean;
  if (clean.includes('-galar')) return clean;
  if (clean.includes('-hisui')) return clean;
  if (clean.includes('-paldea')) return clean;

  return clean.replace(/-/g, '');
};
