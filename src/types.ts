export interface Recipient {
    email: string;
    isSelected: boolean;
  }
  
  export interface GroupedRecipients {
    [domain: string]: string[];
  }
  
  export interface SelectedRecipients {
    [domain: string]: Set<string>;
  }