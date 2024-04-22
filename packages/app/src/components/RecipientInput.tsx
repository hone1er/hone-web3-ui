'use client'
import { useEnsAddress } from 'wagmi'
import { isAddress } from 'viem'
import { useState, useEffect } from 'react'
import { normalize } from 'viem/ens'

type RecipientInputProps = {
  onRecipientChange: (address: string, isValid: boolean) => void
}
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
export const RecipientInput = ({ onRecipientChange }: RecipientInputProps) => {
  const [isValidToAddress, setIsValidToAddress] = useState<boolean>(false)
  const [rawTokenAddress, setRawTokenAddress] = useState<string>('')
  let name

  try {
    name = normalize(rawTokenAddress!)
  } catch (e) {
    console.error(e)
  }
  const { data: ensAddy } = useEnsAddress({
    name: name,
    config: config,
  })

  const handleToAdressInput = (_to: string) => {
    const isValid = isAddress(_to)
    setIsValidToAddress(isValid)

    onRecipientChange(_to, isValid)
    setRawTokenAddress(_to)
  }

  console.log('🚀 ~ RecipientInput ~ name:', name)
  console.log('🚀 ~ RecipientInput ~ ensAddy:', ensAddy)
  useEffect(() => {
    if (ensAddy) {
      onRecipientChange(ensAddy, true)
    } else {
      onRecipientChange(rawTokenAddress, isValidToAddress)
    }

    return () => {}
  }, [ensAddy, isValidToAddress, onRecipientChange, rawTokenAddress])

  return (
    <label className='form-control w-full max-w-xs'>
      <div className='label'>
        <span className='label-text'>Recipient address</span>
      </div>
      <div className='has-tooltip relative'>
        <span
          onClick={() => {
            setRawTokenAddress(ensAddy ?? '')
            setIsValidToAddress(true)
          }}
          className={`${isAddress(ensAddy ?? '') ? 'display' : 'hidden'} absolute px-4 py-2 rounded shadow-lg bg-gray-100 text-black -bottom-10 hover:cursor-pointer`}>
          {ensAddy}
        </span>
        <input
          type='text'
          placeholder='0x...'
          className={`input input-bordered w-full max-w-xs ${!isValidToAddress && rawTokenAddress && !ensAddy ? 'input-error' : ''}`}
          value={rawTokenAddress}
          onChange={(e) => handleToAdressInput(e.target.value)}
        />
      </div>
    </label>
  )
}
