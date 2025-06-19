import orgJson from "../constants/organizationCreation.json" assert { type: "json" };
import layout from "../constants/layout.json" assert { type: "json" };
import dashboard from "../constants/dashboard.json" assert { type: "json" };

export class DashboardService {
  /**
   * Get create organization JSON
   * @returns {Json} Json data
   */
  static getCreateOrganizatoinJson = () => {
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
  static getDashboardJson = () => {
    try {
      return dashboard;
    } catch (error) {
      console.log(error);
    }
  };
}
