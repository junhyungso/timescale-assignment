import { useState, useEffect } from "react";

import recipientsData from "../../assets/recipientsData.json";
import "./Recipients.css";

type Recipient = {
  email: string;
  isSelected: boolean;
};

type RecipientsGroup = {
  [domain: string]: string[];
};

const Recipients = () => {
  const [input, setInput] = useState("");
  const [availableRecipients, setAvailableRecipients] =
    useState<RecipientsGroup>({});
  const [selectedRecipients, setSelectedRecipients] = useState<RecipientsGroup>(
    {}
  );

  const handleInput = (e: any) => {
    setInput(e.target.value);
  };

  const handleAddRecipient = () => {
    if (input.includes("@") && input.length >= 3) {
      const domain = input.split("@")[1];
      const availableRecipientsCopy = { ...availableRecipients };
      if (availableRecipientsCopy[domain]) {
        availableRecipientsCopy[domain].push(input);
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
      } else {
        available[domain] = [email];
      }

      setAvailableRecipients(available);
      setSelectedRecipients(selected);
    });
  }, []);

  useEffect(() => {
    // Object.entries(availableRecipients).filter(([key,value]) => {
    //   if (key.startsWith(input) )
    // })
  }, [input]);

  return (
    <>
      <div className="row">
        <div className="available-column">
          <h3>Available Recipients</h3>
          <input
            type="text"
            value={input}
            onChange={handleInput}
            placeholder="Search"
          />
          <button onClick={handleAddRecipient}>Add</button>
          <div className="available-container">
            {Object.entries(availableRecipients).map(([domain, emails]) => {
              return emails.length === 1 ? (
                <div>
                  <button
                    onClick={() =>
                      handleRecipientClicked(emails[0], "available")
                    }
                  >
                    {emails[0]}
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <button>{">"}</button>
                    <button
                      onClick={() =>
                        handleRecipientClicked(domain, "available", true)
                      }
                    >
                      {domain}
                    </button>
                  </div>
                  {emails.map((email: string) => (
                    <div>
                      <button
                        onClick={() =>
                          handleRecipientClicked(email, "available")
                        }
                      >
                        {email}
                      </button>
                    </div>
                  ))}
                </>
              );
            })}
          </div>
        </div>
        <div className="selected-column">
          <h3>Selected recipients</h3>
          <div className="selected-container">
            <div className="collapsible-group">
              <strong>Company recipients</strong>
              <ul>
                {Object.entries(selectedRecipients).map(
                  ([domain, emails]) =>
                    emails?.length > 1 && (
                      <div key={domain} className="domain-group">
                        <button
                          onClick={() =>
                            handleRecipientClicked(domain, "selected", true)
                          }
                        >
                          {domain}
                        </button>
                        <div>
                          {emails.map((email) => (
                            <div>
                              <button
                                onClick={() =>
                                  handleRecipientClicked(email, "selected")
                                }
                              >
                                {email}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                )}
              </ul>
            </div>
            <div className="collapsible-group">
              <strong>Email recipients</strong>
              <ul>
                {Object.values(selectedRecipients).map(
                  (emails) =>
                    emails?.length === 1 && (
                      <div>
                        <button
                          onClick={() =>
                            handleRecipientClicked(emails[0], "selected")
                          }
                        >
                          {emails[0]}
                        </button>
                      </div>
                    )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recipients;
