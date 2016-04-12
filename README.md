
Memory v1.0.0

# Forudsætninger

- MySQL er tilgængelig på localhost
- NPM og Node.js er installeret på serveren/maskinen

# Beskrivelse

- Byg databasen ved hjælp af db.sql (ligger i hoved folderen)
- Byg projektet med NPM INSTALL (kun hvis du har slettet node_modules folderen)
- Start serveren med NPM START
- Memory spillet er nu tilgængeligt via browseren på localhost:3000

# Noter

Jeg har bevidst holdt mig til vanilla JavaScript og så vidt muligt undgået brug af tredjeparts moduler, herunder specielt jQuery. For dog at understøtte kravet om at brugerens tid skal gemmes i en MySQL database, har jeg været nødt til at inkludere bl.a. jQuery og en MySQL klient på klient-side, samt ExpressJS på server-siden. For at understøtte kravet om IE8 understøttelse har jeg ligeledes inkluderet SoundJS i stedet for at bruge HTML5 audio-tag'et alene, da modulet har fallback til flash for ældrere browsere.

Jeg har forsøgt at være tro mod designoplægget, men enkelte design elementer var ikke tilgængelige i den tilsendte pakke og uden red-lines, har jeg været nødt til at gætte mig til grid størrelse og farver. Håber ikke at det er helt off! Jeg har ikke gjort spillet tilgængeligt på mindre devices, da det ikke var et krav, men det burde design-mæssigt kunne afvikles fornuftigt på devices ned til iPad størrelse (1024px x 768px).

Med hensyn til browser- og device-understøttelse, så håber jeg at jeg har fanget dem alle sammen, men på grund af det begrænsede setup jeg har herhjemme, så har jeg ikke haft de store muligheder for at teste på bl.a. mobile devices (har dog anvendt simuleringer) og heller ikke haft en IE8 tilgængelig.
