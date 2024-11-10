export type Recipient = {
	email: string;
	isSelected: boolean;
};
  
export type RecipientsGroup = {
	[domain: string]: string[];
};
  
export type Toggles = {
	company: boolean;
	individual: boolean;
	[domain: string]: boolean;
};

export type DomainOptions = string[]