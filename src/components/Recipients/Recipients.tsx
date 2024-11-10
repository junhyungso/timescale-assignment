import { useState, useEffect } from "react";

import recipientsData from "../../assets/recipientsData.json";
import "./Recipients.css";
import {
  DomainOptions,
  Recipient,
  RecipientsGroup,
  Toggles,
} from "../../types/types";
import AvailableRecipients from "./AvailableRecipients";
import SelectedRecipients from "./SelectedRecipients";
import isValidEmail from "../../utils/isValidEmail";

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
  const [isValidInput, setIsValidInput] = useState(true);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    const isValid = isValidEmail(input);
    if (!isValid) {
      setIsValidInput(false);
      return;
    }

    const domain = input.split("@")[1];
    setAvailableRecipients((prevRecipients) => {
      const updatedRecipients = { ...prevRecipients };
      if (!updatedRecipients[domain]) {
        updatedRecipients[domain] = [input];
      } else if (!updatedRecipients[domain].includes(input)) {
        updatedRecipients[domain] = [...updatedRecipients[domain], input];
      } else {
        setIsValidInput(false);
        return prevRecipients;
      }
      setIsValidInput(true);
      return updatedRecipients;
    });
  };

  const handleRemoveRecipient = (
    clickedEmail: string,
    domain: string,
    isSelectedRecipient: boolean,
    isDomain?: boolean
  ): RecipientsGroup => {
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

  const toggleExpand = (type: string, expand: boolean) => {
    setExpandToggles((prevToggles) => ({
      ...prevToggles,
      [type]: expand,
    }));
  };

  const handleExpand = (type: string) => toggleExpand(type, true);
  const handleHide = (type: string) => toggleExpand(type, false);

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
    if (isValidEmail(input)) {
      setIsValidInput(true);
    }
  }, [availableRecipients, input]);

  return (
    <div className="row">
      <AvailableRecipients
        availableDomainOptions={availableDomainOptions}
        expandToggles={expandToggles}
        handleSearchedEmailClicked={handleSearchedEmailClicked}
        handleAddRecipient={handleAddRecipient}
        handleInput={handleInput}
        availableRecipients={availableRecipients}
        handleExpand={handleExpand}
        handleHide={handleHide}
        handleRecipientClicked={handleRecipientClicked}
        isValidInput={isValidInput}
      />
      <SelectedRecipients
        expandToggles={expandToggles}
        selectedRecipients={selectedRecipients}
        handleExpand={handleExpand}
        handleHide={handleHide}
        handleRecipientClicked={handleRecipientClicked}
      />
    </div>
  );
};

export default Recipients;
