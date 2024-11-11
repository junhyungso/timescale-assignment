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

    // adds input to available recipients if it is valid based on if its a company based or invidivual email
    setAvailableRecipients((prevRecipients) => {
      if (!prevRecipients[domain]) {
        prevRecipients[domain] = [input];
      } else if (!prevRecipients[domain].includes(input)) {
        prevRecipients[domain] = [...prevRecipients[domain], input];
      } else {
        //invalid
        setIsValidInput(false);
        return prevRecipients;
      }

      //sorts recipient domains to put companies before individuals
      const entries = Object.entries(prevRecipients);
      entries.sort((a, b) => b[1].length - a[1].length);
      const sortedRecipients = Object.fromEntries(entries);

      setInput("");
      setIsValidInput(true);
      return sortedRecipients;
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

    if (recipientCopy[domain]?.length === 1 || isDomain)
      delete recipientCopy[domain];
    else {
      const newDomainEmails =
        recipientCopy[domain]?.filter((email) => email !== clickedEmail) ?? [];
      recipientCopy[domain] = newDomainEmails;
    }

    return recipientCopy;
  };

  const handleRecipientClicked = (
    clickedEmail: string,
    section: string,
    isDomain?: boolean
  ) => {
    const domain = isDomain ? clickedEmail : clickedEmail?.split("@")[1];
    // removes chosen available email when the email is clicked
    if (section === "available" && !isDomain) {
      const selectedRecipientsCopy = { ...selectedRecipients };
      const availableRecipientsCopy = handleRemoveRecipient(
        clickedEmail,
        domain,
        false
      );

      if (!selectedRecipientsCopy[domain]) {
        selectedRecipientsCopy[domain] = [clickedEmail];
      } else {
        selectedRecipientsCopy[domain].push(clickedEmail);
      }

      setAvailableRecipients(availableRecipientsCopy);
      setSelectedRecipients(selectedRecipientsCopy);
    }

    // removes chosen available company emails when the domain is clicked
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

    // removes chosen selected company emails when email is clicked
    if (section === "selected" && !isDomain) {
      const selectedRecipientsCopy = handleRemoveRecipient(
        clickedEmail,
        domain,
        true
      );

      setSelectedRecipients(selectedRecipientsCopy);
    }

    // removes chosen selected individual emails
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
    setInput("");
  };

  //type is either "company", "email" or company domain names
  const toggleExpand = (type: string, expand: boolean) => {
    console.log(type);
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

    // fill json data into correct sections
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
            [domain]: true,
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
    //checks for email input validity
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
        input={input}
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
