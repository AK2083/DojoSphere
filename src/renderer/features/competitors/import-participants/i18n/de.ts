export default {
  page: {
    title: 'Teilnehmer importieren'
  },
  actions: {
    back: 'Zurück zur Teilnehmerliste',
    cancel: 'Abbrechen',
    next: 'Weiter',
    finish: 'Abschließen',
    ariaCancel: 'Import abbrechen',
    ariaNext: 'Nächster Schritt',
    ariaFinish: 'Import abschließen'
  },
  steps: {
    file: {
      title: 'Datei auswählen',
      description: 'Wählen Sie eine Excel-Datei mit Teilnehmerdaten für den Import.',
      inputLabel: 'Excel-Datei',
      ariaInput: 'Excel-Datei für den Import auswählen',
      hint: 'Unterstütztes Format: Excel (.xlsx, .xls)',
      reading: 'Datei wird gelesen…',
      analyzing: 'Spalten werden erkannt…',
      ready: 'Datei erfolgreich eingelesen.',
      previewError:
        'Die Datei konnte nicht gelesen werden. Bitte prüfen Sie das Format und versuchen Sie es erneut.'
    },
    mapping: {
      title: 'Spalten zuordnen',
      description:
        'Ordnen Sie jedem Teilnehmerfeld die passende Spalte aus der Excel-Datei zu. Vorname und Nachname müssen zugeordnet sein; fehlende Pflichtfelder aus dem Formular erhalten einen Standardwert.',
      sourceLabel: 'Dateispalte',
      targetLabel: 'Teilnehmerfeld',
      excelColumn: 'Spalte aus Excel',
      ariaSource: 'Dateispalte auswählen',
      ariaTarget: 'Teilnehmerfeld auswählen',
      notMapped: '— nicht zugeordnet —',
      notAssigned: '— nicht zuordnen —',
      unnamedColumn: '(ohne Spaltenname)',
      requiredLegend: '* Pflichtfeld aus dem Teilnehmerformular',
      sampleLabel: 'Beispiel',
      formField: 'Formular',
      rowCount: '{count} Datenzeilen erkannt',
      missingRequired: 'Bitte ordnen Sie alle Pflichtfelder zu: {fields}',
      defaultApplied: 'Standardwert: {value}',
      defaultValues: {
        birthDate: '01.01.2000',
        passNumber: '00000000'
      },
      badge: {
        header: 'Auto (Spaltenname)',
        data: 'Auto (Daten)',
        manual: 'Manuell',
        default: 'Standardwert'
      }
    },
    import: {
      title: 'Import',
      description: 'Teilnehmer werden importiert.',
      progressLabel: 'Import-Fortschritt',
      complete: 'Import abgeschlossen.',
      resultsListAria: 'Importergebnisse',
      statusSuccess: '{name} erfolgreich importiert',
      statusFailure: '{name} konnte nicht importiert werden',
      summary: '{imported} importiert, {failed} fehlgeschlagen',
      failedHint:
        'Fehlgeschlagene Teilnehmer wurden nicht gespeichert. Prüfen Sie die Zuordnung und die Pflichtfelder.',
      errors: {
        generic:
          'Der Import konnte nicht durchgeführt werden. Bitte Zuordnung prüfen und erneut versuchen.',
        noSession:
          'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an und starten den Import noch einmal.',
        unauthorized:
          'Sie haben keine Berechtigung für den Import. Bitte wenden Sie sich an den Administrator.',
        fileTransfer:
          'Die Datei konnte nicht verarbeitet werden. Bitte wählen Sie die Excel-Datei erneut aus und starten den Import noch einmal.',
        databaseSchema:
          'Die lokale Datenbank ist veraltet. Bitte schließen Sie die Anwendung vollständig und starten Sie sie neu. Danach den Import erneut ausführen.',
        databaseError:
          'Beim Speichern ist ein Datenbankfehler aufgetreten. Bitte Zuordnung und Pflichtfelder prüfen und den Import erneut versuchen.',
        emptyWorkbook:
          'In der Datei wurden keine Teilnehmerzeilen gefunden. Prüfen Sie, ob Vorname und Nachname zugeordnet sind und die Tabelle Daten enthält.',
        parseFailed:
          'Die Excel-Datei konnte nicht gelesen werden. Bitte prüfen Sie das Format (.xlsx oder .xls) und versuchen Sie es erneut.'
      },
      rowErrors: {
        importFailed:
          'Daten unvollständig oder ungültig. Prüfen Sie Pflichtfelder, Verein und Zuordnung für diese Zeile.',
        validationFailed:
          'Die Zeile erfüllt nicht alle Anforderungen. Bitte Daten in der Excel-Datei korrigieren.'
      }
    }
  },
  mapping: {
    targetFields: {
      weightKg: 'Gewicht (kg)'
    }
  }
}
