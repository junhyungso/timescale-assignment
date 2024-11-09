// src/components/RecipientManager.tsx
import React, { useState, useEffect } from "react";
import Autocomplete from "./Autocomplete";
import recipientsData from "./recipientsData.json";
import { GroupedRecipients, SelectedRecipients, Recipient } from "./types";
import "./App.css";

const App: React.FC = () => {
  const [availableRecipients, setAvailableRecipients] =
    useState<GroupedRecipients>({});
  const [selectedRecipients, setSelectedRecipients] =
    useState<SelectedRecipients>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const available: GroupedRecipients = {};
    const selected: SelectedRecipients = {};

    (recipientsData as Recipient[]).forEach(({ email, isSelected }) => {
      const domain = email.split("@")[1];

      if (isSelected) {
        if (!selected[domain]) selected[domain] = new Set();
        selected[domain].add(email);
      } else {
        if (!available[domain]) available[domain] = [];
        available[domain].push(email);
      }
    });

    setAvailableRecipients(available);
    setSelectedRecipients(selected);
  }, []);

  const addRecipient = (email: string) => {
    const domain = email.split("@")[1];
    setAvailableRecipients((prevAvailable) => {
      const updatedAvailable = { ...prevAvailable };
      updatedAvailable[domain] = updatedAvailable[domain].filter(
        (e) => e !== email
      );
      if (updatedAvailable[domain].length === 0)
        delete updatedAvailable[domain];
      return updatedAvailable;
    });
    setSelectedRecipients((prevSelected) => {
      const updatedSelected = { ...prevSelected };
      if (!updatedSelected[domain]) updatedSelected[domain] = new Set();
      updatedSelected[domain].add(email);
      return updatedSelected;
    });
  };

  const removeRecipient = (email: string) => {
    const domain = email.split("@")[1];
    setSelectedRecipients((prevSelected) => {
      const updatedSelected = { ...prevSelected };
      updatedSelected[domain].delete(email);
      if (updatedSelected[domain].size === 0) delete updatedSelected[domain];
      return updatedSelected;
    });
    setAvailableRecipients((prevAvailable) => {
      const updatedAvailable = { ...prevAvailable };
      if (!updatedAvailable[domain]) updatedAvailable[domain] = [];
      updatedAvailable[domain].push(email);
      return updatedAvailable;
    });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredRecipients = Object.entries(availableRecipients).reduce(
    (acc, [domain, emails]) => {
      const filteredEmails = emails.filter((email) =>
        email.toLowerCase().includes(searchTerm)
      );
      if (filteredEmails.length) {
        acc[domain] = filteredEmails;
      }
      return acc;
    },
    {} as GroupedRecipients
  );

  return (
    <div className="recipient-manager">
      <section className="available-recipients">
        <h2>Available recipients</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <ul>
          {Object.entries(filteredRecipients).map(([domain, emails]) => (
            <li key={domain} className="domain-group">
              <strong>{domain}</strong>
              <ul>
                {emails.map((email) => (
                  <li key={email}>
                    <span>{email}</span>
                    <button onClick={() => addRecipient(email)}>Select</button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="selected-recipients">
        <h2>Selected recipients</h2>
        <div className="collapsible-group">
          <button>Company recipients</button>
          <ul>
            {Object.entries(selectedRecipients).map(([domain, emails]) => (
              <li key={domain} className="domain-group">
                <strong>{domain}</strong>
                <ul>
                  {[...emails].map((email) => (
                    <li key={email}>
                      <span>{email}</span>
                      <button onClick={() => removeRecipient(email)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <div className="collapsible-group">
          <button>Email recipients</button>
          {/* This is where you can list recipients added individually, not by domain */}
        </div>
      </section>
    </div>
  );
};

export default App;
