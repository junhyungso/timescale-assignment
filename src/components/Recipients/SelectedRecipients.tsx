import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Search from "@mui/icons-material/Search";

import { RecipientsGroup, Toggles } from "../../types/types";
import "./Recipients.css";

type SelectedRecipientsProps = {
  expandToggles: Toggles;
  selectedRecipients: RecipientsGroup;
  handleExpand: (type: string) => void;
  handleHide: (type: string) => void;
  handleRecipientClicked: (
    clickedEmail: string,
    section: string,
    isDomain?: boolean
  ) => void;
};

const SelectedRecipients = ({
  expandToggles,
  selectedRecipients,
  handleExpand,
  handleHide,
  handleRecipientClicked,
}: SelectedRecipientsProps) => {
  return (
    <div className="selected-column">
      <h3>Selected recipients</h3>
      <div className="selected-container">
        <div>
          <div className="domain-container">
            <div>
              {!expandToggles.company && (
                <ArrowRight onClick={() => handleExpand("company")} />
              )}
              {expandToggles.company && (
                <ArrowDropDown onClick={() => handleHide("company")} />
              )}
            </div>
            <strong>Company recipients</strong>
          </div>
          {expandToggles.company &&
            Object.entries(selectedRecipients).map(
              ([domain, emails]) =>
                emails?.length > 1 && (
                  <div key={domain} className="domain-group">
                    <div className="domain-container">
                      <div className="selected-company-list">
                        {!expandToggles[domain] && (
                          <ArrowRight onClick={() => handleExpand(domain)} />
                        )}
                        {expandToggles[domain] && (
                          <ArrowDropDown onClick={() => handleHide(domain)} />
                        )}
                      </div>
                      <span
                        onClick={() =>
                          handleRecipientClicked(domain, "selected", true)
                        }
                      >
                        {domain}
                      </span>
                    </div>
                    <ul className="selected-company-email-list">
                      {expandToggles[domain] &&
                        emails.map((email) => (
                          <li
                            key={email}
                            className="selected-company-email-list"
                            onClick={() =>
                              handleRecipientClicked(email, "selected")
                            }
                          >
                            {email}
                          </li>
                        ))}
                    </ul>
                  </div>
                )
            )}
        </div>
        <div>
          <div className="domain-container">
            <div>
              {!expandToggles.individual && (
                <ArrowRight
                  data-testid={"expand-arrow"}
                  onClick={() => handleExpand("individual")}
                />
              )}
              {expandToggles.individual && (
                <ArrowDropDown
                  data-testid={"hide-arrow"}
                  onClick={() => handleHide("individual")}
                />
              )}
            </div>
            <strong>Email recipients</strong>
          </div>
          {expandToggles.individual && (
            <ul>
              {Object.values(selectedRecipients).map(
                (emails) =>
                  emails?.length === 1 && (
                    <li
                      key={emails[0]}
                      className="selected-email-list"
                      onClick={() =>
                        handleRecipientClicked(emails[0], "selected")
                      }
                    >
                      {emails[0]}
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedRecipients;
