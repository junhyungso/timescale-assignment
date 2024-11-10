import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Search from "@mui/icons-material/Search";

import recipientsData from "../../assets/recipientsData.json";
import "./Recipients.css";
import {
  DomainOptions,
  Recipient,
  RecipientsGroup,
  Toggles,
} from "../../types/types";

const Recipients = () => {
  const [input, setInput] = useState("");
  const [availableRecipients, setAvailableRecipients] =
    useState<RecipientsGroup>({});
  const [selectedRecipients, setSelectedRecipients] = useState<RecipientsGroup>(
    {}
  );
  const [availableDomainOptions, setAvailableDomainOptions] =
    useState<DomainOptions>([]);
  const [expandToggles, setExpandToggles] = useState<Toggles>({
    company: false,
    individual: false,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const isValidEmail = (email: string) => {
    const name = email.split("@")[0];
    const domain = email.split("@")[1];
    return (
      email.includes("@") &&
      domain.includes(".") &&
      email.length >= 3 &&
      name.length > 0
    );
  };

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValidEmail(input)) {
      const domain = input.split("@")[1];
      const availableRecipientsCopy = { ...availableRecipients };

      if (
        availableRecipientsCopy[domain] &&
        !availableRecipientsCopy[domain].includes(input)
      ) {
        availableRecipientsCopy[domain].push(input);
      } else if (
        availableRecipientsCopy[domain] &&
        availableRecipientsCopy[domain].includes(input)
      ) {
        alert("Email already exists!");
      } else {
        availableRecipientsCopy[domain] = [input];
      }
      setAvailableRecipients(availableRecipientsCopy);
    }
  };

  const handleRemoveRecipient = (
    clickedEmail: string,
    domain: string,
    isSelectedRecipient: boolean,
    isDomain?: boolean
  ) => {
    const recipientCopy = isSelectedRecipient
      ? { ...selectedRecipients }
      : { ...availableRecipients };

    if (recipientCopy[domain].length === 1 || isDomain)
      delete recipientCopy[domain];
    else {
      const newDomainEmails = recipientCopy[domain].filter(
        (email) => email !== clickedEmail
      );
      recipientCopy[domain] = newDomainEmails;
    }

    return recipientCopy;
  };

  const handleRecipientClicked = (
    clickedEmail: string,
    section: string,
    isDomain?: boolean
  ) => {
    const domain = isDomain ? clickedEmail : clickedEmail.split("@")[1];

    if (section === "available" && !isDomain) {
      const selectedRecipientsCopy = { ...selectedRecipients };
      const availableRecipientsCopy = handleRemoveRecipient(
        clickedEmail,
        domain,
        false
      );
      setAvailableRecipients(availableRecipientsCopy);

      if (!selectedRecipientsCopy[domain]) {
        selectedRecipientsCopy[domain] = [clickedEmail];
      } else {
        selectedRecipientsCopy[domain].push(clickedEmail);
      }
      setSelectedRecipients(selectedRecipientsCopy);
    }

    if (section === "available" && isDomain) {
      const availableRecipientsCopy = handleRemoveRecipient(
        clickedEmail,
        domain,
        false,
        isDomain
      );
      const selectedRecipientsCopy = { ...selectedRecipients };

      const domainEmails = availableRecipients[clickedEmail];
      if (selectedRecipientsCopy[clickedEmail]) {
        selectedRecipientsCopy[clickedEmail].push(...domainEmails);
      } else {
        selectedRecipientsCopy[clickedEmail] = domainEmails;
      }
      setAvailableRecipients(availableRecipientsCopy);
      setSelectedRecipients(selectedRecipientsCopy);
    }

    if (section === "selected" && !isDomain) {
      const selectedRecipientsCopy = handleRemoveRecipient(
        clickedEmail,
        domain,
        true
      );
      setSelectedRecipients(selectedRecipientsCopy);
    }

    if (section === "selected") {
      const selectedRecipientsCopy = handleRemoveRecipient(
        clickedEmail,
        domain,
        true,
        isDomain
      );
      setSelectedRecipients(selectedRecipientsCopy);
    }
  };

  const handleSearchedEmailClicked = (e: any, value: any) => {
    handleRecipientClicked(value, "available");
  };

  const handleExpand = (type: string) => {
    if (type === "company") {
      setExpandToggles((prevToggles) => {
        return { ...prevToggles, company: true };
      });
    } else if (type === "individual") {
      setExpandToggles((prevToggles) => {
        return { ...prevToggles, individual: true };
      });
    } else {
      setExpandToggles((prevToggles) => {
        return { ...prevToggles, [type]: true };
      });
    }
  };

  const handleHide = (type: string) => {
    if (type === "company") {
      setExpandToggles((prevToggles) => {
        return { ...prevToggles, company: false };
      });
    } else if (type === "individual") {
      setExpandToggles((prevToggles) => {
        return { ...prevToggles, individual: false };
      });
    } else {
      setExpandToggles((prevToggles) => {
        return { ...prevToggles, [type]: false };
      });
    }
  };

  useEffect(() => {
    const available: RecipientsGroup = {};
    const selected: RecipientsGroup = {};

    (recipientsData as Recipient[]).forEach(({ email, isSelected }) => {
      const domain = email.split("@")[1];

      if (isSelected && selected[domain]) {
        selected[domain] = [...selected[domain], email];
      } else if (isSelected) {
        selected[domain] = [email];
      } else if (!isSelected && available[domain]) {
        available[domain] = [...available[domain], email];
        setExpandToggles((prevToggles) => {
          return {
            ...prevToggles,
            domain: true,
          };
        });
      } else {
        available[domain] = [email];
        setExpandToggles((prevToggles) => {
          return {
            ...prevToggles,
            [domain]: true,
          };
        });
      }

      setAvailableRecipients(available);
      setSelectedRecipients(selected);
    });
  }, []);

  useEffect(() => {
    for (let key of Object.keys(availableRecipients)) {
      if (key.startsWith(input) && input.length > 0) {
        setAvailableDomainOptions(availableRecipients[key]);
      }
    }
  }, [availableRecipients, input]);

  return (
    <>
      <div className="row">
        <div className="available-column">
          <h3>Available recipients</h3>
          <Autocomplete
            size="small"
            disablePortal
            options={availableDomainOptions}
            onChange={handleSearchedEmailClicked}
            renderInput={(params) => (
              <TextField
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
                          onClick={() =>
                            handleRecipientClicked(email, "available")
                          }
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
                              <ArrowRight
                                onClick={() => handleExpand(domain)}
                              />
                            )}
                            {expandToggles[domain] && (
                              <ArrowDropDown
                                onClick={() => handleHide(domain)}
                              />
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
      </div>
    </>
  );
};

export default Recipients;
