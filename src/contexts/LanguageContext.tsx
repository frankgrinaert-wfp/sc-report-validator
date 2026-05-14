/* eslint-disable react-refresh/only-export-components -- context + hook module */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Language = "EN" | "FR";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations: Record<Language, Record<string, string>> = {
  EN: {
    "app.title": "Monthly Report Review Dashboard",
    "app.sync": "Sync",

    "dashboard.month": "Month",
    "dashboard.year": "Year",
    "dashboard.country": "Country",
    "dashboard.adminRegion": "Admin Region",
    "dashboard.selectMonth": "Select month",
    "dashboard.selectYear": "Select year",
    "dashboard.selectCountry": "Select country",
    "dashboard.selectRegion": "Select region",

    "month.january": "January",
    "month.february": "February",
    "month.march": "March",
    "month.april": "April",
    "month.may": "May",
    "month.june": "June",
    "month.july": "July",
    "month.august": "August",
    "month.september": "September",
    "month.october": "October",
    "month.november": "November",
    "month.december": "December",

    "country.gambia": "Gambia",
    "country.senegal": "Senegal",
    "country.guinea": "Guinea",
    "country.mali": "Mali",
    "country.burkinaFaso": "Burkina Faso",

    "region.adminRegion1": "Admin Region 1",
    "region.adminRegion2": "Admin Region 2",
    "region.adminRegion3": "Admin Region 3",
    "region.adminRegion4": "Admin Region 4",

    "dashboard.lastUpdated": "Last updated: August 2025",
    "dashboard.schoolReport": "School Monthly Report for May 2025",
    "dashboard.downloadAll": "Download All Schools Report",
    "dashboard.qualityAll": "Quality (All)",
    "dashboard.qualityExcellent": "Quality (Excellent)",
    "dashboard.qualityGood": "Quality (Good)",
    "dashboard.qualityFair": "Quality (Fair)",
    "dashboard.qualityCritical": "Quality (Critical)",
    "dashboard.filterQuality": "Filter by Quality Level:",
    "dashboard.orderBy": "Order By:",
    "dashboard.scoreAsc": "Score (Ascending)",
    "dashboard.scoreDesc": "Score (Descending)",
    "dashboard.quality": "Quality",
    "dashboard.status": "Status",
    "dashboard.avgAttendance": "Average School Attendance",
    "dashboard.mealsDelivered": "Meals Delivered",
    "dashboard.total": "Total",
    "dashboard.boys": "Boys",
    "dashboard.girls": "Girls",
    "dashboard.totalMealsDelivered": "Total meals delivered",
    "dashboard.avgMealsPerDay": "Average meals per day",

    "stats.totalSchools": "Total Schools",
    "stats.excellent": "Excellent",
    "stats.excellentDesc": "Schools with data quality score of 90% or higher",
    "stats.good": "Good",
    "stats.goodDesc": "Schools with data quality score between 80-89%",
    "stats.fair": "Fair",
    "stats.fairDesc": "Schools with data quality score between 70-79%",
    "stats.critical": "Critical",
    "stats.criticalDesc": "Schools with data quality score below 70%",

    "table.rank": "Rank",
    "table.schoolName": "School Name",
    "table.score": "Score",
    "table.qualityLevel": "Quality Level",
    "table.status": "Status",
    "table.actions": "Actions",
    "table.viewDetails": "View Details",

    "status.toBeReviewed": "To be Reviewed",
    "status.waitingCorrections": "Waiting for Corrections",
    "status.accepted": "Accepted",

    "quality.excellent": "Excellent",
    "quality.good": "Good",
    "quality.fair": "Fair",
    "quality.critical": "Critical",
    "quality.all": "All",

    "panel.title": "Control Panel",
    "panel.resetThresholds": "Reset Thresholds",
    "panel.resetFilters": "Reset Filters",
    "panel.thresholdSettings": "Threshold Settings",
    "panel.consumptionThresholds": "Consumption Thresholds",
    "panel.cerealsMax": "Cereals (max grams/student)",
    "panel.pulsesMax": "Pulses (max grams/student)",
    "panel.aggregatedMax": "Aggregated (max grams/student)",
    "panel.aggregatedMin": "Aggregated (min grams/student)",
    "panel.expectedPrices": "Expected Commodity Prices",
    "panel.ricePrice": "Rice (per Kg)",
    "panel.beansPrice": "Beans (per Kg)",
    "panel.sorghumPrice": "Sorghum (per Kg)",
    "panel.maizePrice": "Maize (per Kg)",
    "panel.oilPrice": "Oil (per L)",
    "panel.alertsFilter": "Alerts Filter",
    "panel.selectAll": "Select All",
    "panel.deselectAll": "Deselect All",

    "alert.purchasePrice": "Purchase & Price",
    "alert.attendance": "Attendance & Enrolment",
    "alert.consumption": "Consumption",
    "alert.incident": "Incident",
    "alert.crossFile": "Cross-File",

    "threshold.cerealsMax": "Cereals Max (g)",
    "threshold.pulsesMax": "Pulses Max (g)",
    "threshold.aggregatedMax": "Aggregated Max (g)",
    "threshold.aggregatedMin": "Aggregated Min (g)",

    "commodity.rice": "Rice (per Kg)",
    "commodity.beans": "Beans (per Kg)",
    "commodity.sorghum": "Sorghum ($/kg)",
    "commodity.maize": "Maize (per Kg)",
    "commodity.oil": "Oil (per L)",
    "commodity.millet": "Millet ($/kg)",
    "commodity.salt": "Salt ($/kg)",
    "commodity.palmOil": "Palm oil - red ($/kg)",
    "commodity.onion": "Onion ($/kg)",
    "commodity.sweetPotato": "Sweet potato leaves ($/kg)",
    "commodity.driedFish": "Dried Fish ($/kg)",
    "commodity.fishFresh": "Fish - fresh ($/kg)",

    "issue.purchasePriceHigh": "Purchase price is suspiciously high",
    "issue.purchasePriceLow": "Purchase price is suspiciously low",
    "issue.batchMissing": "Batch number is missing",
    "issue.batchDigits": "Batch number is less than required digits",
    "issue.batchDuplicate":
      "Two or more commodities have the same batch number",
    "issue.vendorMissing": "Missing Vendor Information",

    "issue.attendanceHigh":
      "Daily Attendance is higher than the tolerance level",
    "issue.attendanceLow":
      "Daily Attendance is lower than the tolerance level",
    "issue.attendanceSame":
      "Daily Attendance is the same for all school days within the month",
    "issue.attendanceExceeds": "Daily Attendance exceeds enrolment",
    "issue.enrolmentIncrease":
      "Enrolment update exceeds previous enrolment by 50 percent",
    "issue.noAbsences": "No absences recorded for 10 consecutive days",
    "issue.attendanceMissing": "Attendance data is missing",
    "issue.attendanceZero": "Attendance is recorded as zero",

    "issue.cerealsExceeds":
      "Cereals consumption per student exceeds maximum",
    "issue.pulsesExceeds":
      "Pulses consumption per student exceeds maximum",
    "issue.consumptionHigh":
      "Aggregated daily consumption per student exceeds maximum",
    "issue.consumptionLow":
      "Aggregated daily consumption per student is lower than minimum",
    "issue.consumptionZero":
      "Aggregated daily consumption per student is zero",
    "issue.consumptionMissing":
      "Aggregated daily consumption per student is missing",

    "issue.foodStolen":
      'A loss is recorded with the "Food was stolen" reason',
    "issue.lossOther":
      'A loss is recorded with "Other" and no comment is written',
    "issue.lossExceeds": "Incident quantity loss exceeds threshold",

    "issue.attendanceNoMeal":
      "Attendance was recorded, but no meal consumption or reason for no meal was provided",
    "issue.stockInconsistency":
      'Stock present on a day recorded as "No Stock"',
    "issue.saltNotUsed": "Meal served without salt, but salt was in stock",
    "issue.oilNotUsed": "Meal served without oil, but oil was in stock",

    "detail.month": "Month: 2025-05",
    "detail.status": "Status:",
    "detail.downloadReport": "Download Issues Report",
    "detail.backToList": "Back to List",
    "detail.dataQuality": "Data Quality Score",
    "detail.dataQualityDesc":
      "Overall assessment of data completeness and accuracy",
    "detail.currentScore": "Current Score",
    "detail.qualityLevel": "Quality Level:",
    "detail.flaggedIssues": "Flagged Issues",
    "detail.occurrences": "occurrence",
    "detail.occurrencesPlural": "occurrences",
    "detail.historical": "Historical Data Quality Score",
    "detail.historicalDesc":
      "Trend of data quality scores over the last 12 months",
    "detail.previous": "Previous School",
    "detail.next": "Next School",

    "severity.warning": "warning",
    "severity.error": "error",
    "severity.critical": "critical",
    "severity.info": "info",

    "issueTable.date": "Date",

    "aria.home": "Dashboard home",
    "aria.showPanel": "Show control panel",
    "aria.hidePanel": "Hide control panel",
    "aria.connection": "Connection status",
    "aria.settings": "Settings",
  },
  FR: {
    "app.title": "Tableau de Bord de Révision des Rapports Mensuels",
    "app.sync": "Sync",

    "dashboard.month": "Mois",
    "dashboard.year": "Année",
    "dashboard.country": "Pays",
    "dashboard.adminRegion": "Région Administrative",
    "dashboard.selectMonth": "Sélectionner le mois",
    "dashboard.selectYear": "Sélectionner l'année",
    "dashboard.selectCountry": "Sélectionner le pays",
    "dashboard.selectRegion": "Sélectionner la région",

    "month.january": "Janvier",
    "month.february": "Février",
    "month.march": "Mars",
    "month.april": "Avril",
    "month.may": "Mai",
    "month.june": "Juin",
    "month.july": "Juillet",
    "month.august": "Août",
    "month.september": "Septembre",
    "month.october": "Octobre",
    "month.november": "Novembre",
    "month.december": "Décembre",

    "country.gambia": "Gambie",
    "country.senegal": "Sénégal",
    "country.guinea": "Guinée",
    "country.mali": "Mali",
    "country.burkinaFaso": "Burkina Faso",

    "region.adminRegion1": "Région Administrative 1",
    "region.adminRegion2": "Région Administrative 2",
    "region.adminRegion3": "Région Administrative 3",
    "region.adminRegion4": "Région Administrative 4",

    "dashboard.lastUpdated": "Dernière mise à jour : Août 2025",
    "dashboard.schoolReport": "Rapport Mensuel des Écoles pour Mai 2025",
    "dashboard.downloadAll": "Télécharger le Rapport de Toutes les Écoles",
    "dashboard.qualityAll": "Qualité (Toutes)",
    "dashboard.qualityExcellent": "Qualité (Excellente)",
    "dashboard.qualityGood": "Qualité (Bonne)",
    "dashboard.qualityFair": "Qualité (Acceptable)",
    "dashboard.qualityCritical": "Qualité (Critique)",
    "dashboard.filterQuality": "Filtrer par Niveau de Qualité :",
    "dashboard.orderBy": "Trier par :",
    "dashboard.scoreAsc": "Score (Croissant)",
    "dashboard.scoreDesc": "Score (Décroissant)",
    "dashboard.quality": "Qualité",
    "dashboard.status": "Statut",
    "dashboard.avgAttendance": "Fréquentation Scolaire Moyenne",
    "dashboard.mealsDelivered": "Repas Distribués",
    "dashboard.total": "Total",
    "dashboard.boys": "Garçons",
    "dashboard.girls": "Filles",
    "dashboard.totalMealsDelivered": "Total des repas distribués",
    "dashboard.avgMealsPerDay": "Moyenne de repas par jour",

    "stats.totalSchools": "Total des Écoles",
    "stats.excellent": "Excellente",
    "stats.excellentDesc":
      "Écoles avec un score de qualité des données de 90% ou plus",
    "stats.good": "Bonne",
    "stats.goodDesc":
      "Écoles avec un score de qualité des données entre 80-89%",
    "stats.fair": "Acceptable",
    "stats.fairDesc":
      "Écoles avec un score de qualité des données entre 70-79%",
    "stats.critical": "Critique",
    "stats.criticalDesc":
      "Écoles avec un score de qualité des données inférieur à 70%",

    "table.rank": "Rang",
    "table.schoolName": "Nom de l'École",
    "table.score": "Score",
    "table.qualityLevel": "Niveau de Qualité",
    "table.status": "Statut",
    "table.actions": "Actions",
    "table.viewDetails": "Voir Détails",

    "status.toBeReviewed": "À Réviser",
    "status.waitingCorrections": "En Attente de Corrections",
    "status.accepted": "Accepté",

    "quality.excellent": "Excellente",
    "quality.good": "Bonne",
    "quality.fair": "Acceptable",
    "quality.critical": "Critique",
    "quality.all": "Toutes",

    "panel.title": "Panneau de Contrôle",
    "panel.resetThresholds": "Réinitialiser les Seuils",
    "panel.resetFilters": "Réinitialiser les Filtres",
    "panel.thresholdSettings": "Paramètres de Seuil",
    "panel.consumptionThresholds": "Seuils de Consommation",
    "panel.cerealsMax": "Céréales (max grammes/élève)",
    "panel.pulsesMax": "Légumineuses (max grammes/élève)",
    "panel.aggregatedMax": "Agrégé (max grammes/élève)",
    "panel.aggregatedMin": "Agrégé (min grammes/élève)",
    "panel.expectedPrices": "Prix des Produits Attendus",
    "panel.ricePrice": "Riz (par Kg)",
    "panel.beansPrice": "Haricots (par Kg)",
    "panel.sorghumPrice": "Sorgho (par Kg)",
    "panel.maizePrice": "Maïs (par Kg)",
    "panel.oilPrice": "Huile (par L)",
    "panel.alertsFilter": "Filtre des Alertes",
    "panel.selectAll": "Tout Sélectionner",
    "panel.deselectAll": "Tout Désélectionner",

    "alert.purchasePrice": "Achat & Prix",
    "alert.attendance": "Fréquentation & Inscription",
    "alert.consumption": "Consommation",
    "alert.incident": "Incident",
    "alert.crossFile": "Inter-fichiers",

    "threshold.cerealsMax": "Cereals Max (g)",
    "threshold.pulsesMax": "Pulses Max (g)",
    "threshold.aggregatedMax": "Aggregated Max (g)",
    "threshold.aggregatedMin": "Aggregated Min (g)",

    "commodity.rice": "Riz (par Kg)",
    "commodity.beans": "Haricots (par Kg)",
    "commodity.sorghum": "Sorgho ($/kg)",
    "commodity.maize": "Maïs (par Kg)",
    "commodity.oil": "Huile (par L)",
    "commodity.millet": "Millet ($/kg)",
    "commodity.salt": "Sel ($/kg)",
    "commodity.palmOil": "Huile de Palme - rouge ($/kg)",
    "commodity.onion": "Oignon ($/kg)",
    "commodity.sweetPotato": "Feuilles de Patate Douce ($/kg)",
    "commodity.driedFish": "Poisson Séché ($/kg)",
    "commodity.fishFresh": "Poisson Frais ($/kg)",

    "issue.purchasePriceHigh": "Le prix d'achat est suspectivement élevé",
    "issue.purchasePriceLow": "Le prix d'achat est suspectivement bas",
    "issue.batchMissing": "Le numéro de lot est manquant",
    "issue.batchDigits":
      "Le numéro de lot est inférieur au nombre de chiffres requis",
    "issue.batchDuplicate":
      "Deux ou plusieurs produits ont le même numéro de lot",
    "issue.vendorMissing": "Informations du vendeur manquantes",

    "issue.attendanceHigh":
      "La fréquentation quotidienne est supérieure au niveau de tolérance",
    "issue.attendanceLow":
      "La fréquentation quotidienne est inférieure au niveau de tolérance",
    "issue.attendanceSame":
      "La fréquentation quotidienne est la même pour tous les jours scolaires du mois",
    "issue.attendanceExceeds":
      "La fréquentation quotidienne dépasse l'inscription",
    "issue.enrolmentIncrease":
      "La mise à jour de l'inscription dépasse l'inscription précédente de 50 pour cent",
    "issue.noAbsences":
      "Aucune absence enregistrée pendant 10 jours consécutifs",
    "issue.attendanceMissing": "Données de fréquentation manquantes",
    "issue.attendanceZero": "La fréquentation est enregistrée à zéro",

    "issue.cerealsExceeds":
      "La consommation de céréales par élève dépasse le maximum",
    "issue.pulsesExceeds":
      "La consommation de légumineuses par élève dépasse le maximum",
    "issue.consumptionHigh":
      "La consommation quotidienne agrégée par élève dépasse le maximum",
    "issue.consumptionLow":
      "La consommation quotidienne agrégée par élève est inférieure au minimum",
    "issue.consumptionZero":
      "La consommation quotidienne agrégée par élève est zéro",
    "issue.consumptionMissing":
      "La consommation quotidienne agrégée par élève est manquante",

    "issue.foodStolen":
      'Une perte est enregistrée avec la raison "Le nourriture a été volée"',
    "issue.lossOther":
      'Une perte est enregistrée avec "Autre" et aucun commentaire n\'est écrit',
    "issue.lossExceeds":
      "La quantité de perte de l'incident dépasse le seuil",

    "issue.attendanceNoMeal":
      "La fréquentation a été enregistrée, mais aucune consommation de repas ou raison de l'absence de repas n'a été fournie",
    "issue.stockInconsistency":
      'Stock présent sur un jour enregistré comme "Pas de Stock"',
    "issue.saltNotUsed":
      "Repas servi sans sel, mais du sel était en stock",
    "issue.oilNotUsed":
      "Repas servi sans huile, mais de l'huile était en stock",

    "detail.month": "Mois : 2025-05",
    "detail.status": "Statut :",
    "detail.downloadReport": "Télécharger le Rapport des Problèmes",
    "detail.backToList": "Retour à la Liste",
    "detail.dataQuality": "Score de Qualité des Données",
    "detail.dataQualityDesc":
      "Évaluation globale de l'exhaustivité et de l'exactitude des données",
    "detail.currentScore": "Score Actuel",
    "detail.qualityLevel": "Niveau de Qualité :",
    "detail.flaggedIssues": "Problèmes Signalés",
    "detail.occurrences": "occurrence",
    "detail.occurrencesPlural": "occurrences",
    "detail.historical": "Historique du Score de Qualité des Données",
    "detail.historicalDesc":
      "Tendance des scores de qualité des données au cours des 12 derniers mois",
    "detail.previous": "École Précédente",
    "detail.next": "École Suivante",

    "severity.warning": "avertissement",
    "severity.error": "erreur",
    "severity.critical": "critique",
    "severity.info": "info",

    "issueTable.date": "Date",

    "aria.home": "Accueil du tableau de bord",
    "aria.showPanel": "Afficher le panneau de contrôle",
    "aria.hidePanel": "Masquer le panneau de contrôle",
    "aria.connection": "État de la connexion",
    "aria.settings": "Paramètres",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("EN");

  const t = (key: string): string => {
    return translations[language][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
