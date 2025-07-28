import orgJson from "../constants/organizationCreation.json" assert { type: "json" };
import layout from "../constants/layout.json" assert { type: "json" };
import dashboard from "../constants/dashboard.json" assert { type: "json" };

export class DashboardService {
  /**
   * Get create organization JSON
   * @returns {Json} Json data
   */
  static getCreateOrganizationJson = () => {
    try {
      return orgJson;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Get layout JSON
   * @returns {Json} Json data
   */
  static getLayoutJson = () => {
    try {
      return layout;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Get dashboard JSON
   * @returns {Json} Json data
   */
  static getDashboardJson = (query) => {
    try {
      const data = dashboard.dashboard;
      // console.log("query", query);
      switch (query) {
        case "tasks":
          return data.tasks;
        case "quickActions":
          return data.quickActions;
        case "quickTask":
          return data.quickTask;
        case "attendanceData":
          return data.attendanceData;
        case "dailyActivity":
          return data.dailyActivity;
        case "engagementTableData":
          return data.engagementTableData;
        case "leftSideOverview":
          return data.leftSideOverview;
        default:
          return { error: "No value found for the given query" };
      }
    } catch (error) {
      console.log(error);
    }
  };
}
