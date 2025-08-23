# Pawdia – Digitale Tiervermittlungsplattform 

**Diese Webapp wurde mit Next.js entwickelt**

----

Pawdia ist eine Webapp zur digitalen Tiervermittlung. Die Plattform bietet:
- **Rollen & Auth** für Nutzer, Tierheime und Admins (NextAuth + JWT)
- **Tierverwaltung** (Tiere anlegen, bearbeiten, löschen – durch Tierheime)
- **Filtersuche** (z. B. Tierart, Rasse, Alter, Größe, Geschlecht, PLZ/Umkreis)
- **Favoriten** (Nutzer können Tiere speichern)
- **Chatfunktion** (Nutzer ↔ Tierheim)
- **Blog** mit dynamischen Inhaltsblöcken (Überschrift, Text, Bild)

----

## 1 Voraussetzungen

- **Node.js** 
- **MySQL** 8.x 
- **npm** oder **yarn**
- Optional: **Insomnia/Postman** für API-Tests

----

## 2 Installation

1. Entpacke die abgegebene ZIP-Datei.  
2. Öffne das Projekt im Terminal und wechsle in den Projektordner:
   ```bash
   cd pawdia

# Dependencies
npm install

# Umgebungsvariablen
Für die Ausführung muss eine eigene **.env.local** im Projektordner angelegt werden.

Wichtige Variablen:

- DATABASE_URL – Verbindungs-URL zur MySQL-Datenbank

- NEXTAUTH_SECRET – Secret für NextAuth

- GITHUB_ID, GITHUB_SECRET – Login über GitHub (optional)

- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET – Login über Google (optional)

- EMAIL_USER, EMAIL_PASS, EMAIL_RECEIVER - Notwendig für die Tierheim-Bewerbung

# Datenbank einrichten

- Prisma Migration starten: Befehl in das Terminal des Projektes:
npx prisma migrate dev

Optional liegt im Projektverzeichnis ein MySQL-Export mit Testdaten (Tiere, Tierheime, Blogposts)

----

## 3 Projekt starten

- Entwicklungsserver starten:
Befehl im Terminal des Projektes ausführen:
   ```bash
   npm run dev
