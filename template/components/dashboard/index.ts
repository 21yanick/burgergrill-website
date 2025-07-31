/**
 * 📊 DASHBOARD COMPONENTS EXPORT
 * Modern dashboard components for restaurant management
 * 
 * Components:
 * - DashboardHeader: Navigation, theme, user controls
 * - LogoutButton: Secure logout functionality
 * - Opening Hours: Weekly time management
 * - Special Hours: Holiday/vacation management
 */

// Header & Navigation
export { DashboardHeader } from './dashboard-header';
export { LogoutButton } from './logout-button';

// Opening Hours Management
export { WeeklyEditor } from './opening-hours/weekly-editor';
export { DayTimeEditor } from './opening-hours/day-time-editor';
export { LivePreview } from './opening-hours/live-preview';

// Special Hours Management
export { HolidayManager } from './special-hours/holiday-manager';