import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Search from "@mui/icons-material/Search";

import {
  DomainOptions,
  Recipient,
  RecipientsGroup,
  Toggles,
} from "../../types/types";
import "./Recipients.css";

type AvailableRecipientsProp = {
  availableDomainOptions: DomainOptions;
  expandToggles: Toggles;
  handleSearchedEmailClicked: (e: any, value: any) => void;
  handleAddRecipient: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableRecipients: RecipientsGroup;
  handleExpand: (type: string) => void;
  handleHide: (type: string) => void;
  handleRecipientClicked: (
    clickedEmail: string,
    section: string,
    isDomain?: boolean
  ) => void;
  isValidInput: boolean;
};

const AvailableRecipients = ({
  availableDomainOptions,
  expandToggles,
  handleSearchedEmailClicked,
  handleAddRecipient,
  handleInput,
  availableRecipients,
  handleExpand,
  handleHide,
  handleRecipientClicked,
  isValidInput,
}: AvailableRecipientsProp) => {
  return (
    <div className="available-column">
      <h3>Available recipients</h3>
      <Autocomplete
        size="small"
        disablePortal
        options={availableDomainOptions}
        onChange={handleSearchedEmailClicked}
        renderInput={(params) => (
          <TextField
            error={!isValidInput}
            helperText={!isValidInput && "Invlid or duplicare email."}
            onKeyDown={handleAddRecipient}
            {...params}
            onChange={handleInput}
            label={
              <div className="textfield-label">
                <Search />
                <div>search</div>
              </div>
            }
            variant="standard"
          />
        )}
      />
      <div className="available-container">
        {Object.entries(availableRecipients).map(([domain, emails]) => {
          return emails.length > 1 ? (
            <div key={domain}>
              <div className="domain-container">
                <div>
                  {!expandToggles[domain] && (
                    <ArrowRight
                      className="arrow"
                      onClick={() => handleExpand(domain)}
                    />
                  )}
                  {expandToggles[domain] && (
                    <ArrowDropDown
                      className="arrow"
                      onClick={() => handleHide(domain)}
                    />
                  )}
                </div>
                <span
                  onClick={() =>
                    handleRecipientClicked(domain, "available", true)
                  }
                >
                  {domain}
                </span>
              </div>
              <ul className="available-email-list">
                {expandToggles[domain] &&
                  emails.map((email: string) => (
                    <li
                      key={email}
                      className="company-email-list"
                      onClick={() => handleRecipientClicked(email, "available")}
                    >
                      {email}
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <li
              key={emails[0]}
              onClick={() => handleRecipientClicked(emails[0], "available")}
            >
              {emails[0]}
            </li>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableRecipients;
