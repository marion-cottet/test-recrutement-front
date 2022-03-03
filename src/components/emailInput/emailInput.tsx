import React from "react"
import { validate } from 'email-validator';
import providers from "./providersList"
import '../../css/emailInput.css'

const getProvidersSuggestions= (input?: string): string[] => {
  if(input && validate(input)) { // If input is a valid email
    // Return no providers suggestion
    return []
  } else {
    const splittedInput = input?.split('@'); // split the input to check what has been written after the '@'
    if (!splittedInput || splittedInput.length < 2) { // If there is no input or it doesn't contain an '@'
      // Return the first 3 providers of the list
      return providers.slice(0, 3);
    } else {
      // Else, filter the providers that match what the user has written after the '@'
      const bestProviders = providers.filter(provider => provider.startsWith(splittedInput[1]));
      // If there is no provider that match the input, return the first 3 of the list, else return the first 3 providers that match the input
      return bestProviders.length > 0 ? bestProviders.slice(0, 3) : providers.slice(0, 3);
    }
  }
}

const completeEmail = (email: string, provider: string): string => {
  if (email.indexOf('@') > 0) { // If the email contains an '@'
    // Replace what is after the '@' by the selected provider
    return email.replace(/@(.*)/, '@' + provider);
  } else {
    // Else, just append the selected provider to the email after adding an '@'
    return email.concat('@' + provider);
  }
}

const EmailInput: React.FC = () => {
  const [displayedProviders, setDisplayedProviders] = React.useState<string[]>(getProvidersSuggestions());
  const [email, setEmail] = React.useState<string>("");
  const emailInputRef = React.useRef<HTMLInputElement>(null) ;

  return (
    <div>
      <input type="email" value={email} ref={emailInputRef} className="emailInput" onChange={(event) => {
        setDisplayedProviders(getProvidersSuggestions(event.target.value))
        setEmail(event.target.value)
      }}/>
      {
        displayedProviders.map(
          (provider: string, index: number) => (
            <button key={index} className="providerSuggestion" onClick={() => {
              setEmail(completeEmail(email,provider))
              setDisplayedProviders([])
              emailInputRef?.current?.focus()
            }}>
              @{provider}
            </button>
          )
        )
      }
    </div>
  )
}

export default EmailInput