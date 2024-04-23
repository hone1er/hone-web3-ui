'use client'
import { useState, useEffect } from 'react'
import { isAddress } from 'viem'
import { getEnsAvatar, normalize } from 'viem/ens'
import { mainnet, sepolia } from 'wagmi/chains'
import { createConfig, useEnsAddress, http, useEnsAvatar } from 'wagmi'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import Image from 'next/image'
type EthAddressInputProps = {
  label: string
  onRecipientChange: (address: string, isValid: boolean) => void
  onRawInputChange?: (address: string) => void
}
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

function truncateAddress(address: string) {
  return `${address.slice(0, 8)}...${address.slice(-8)}`
}

export const EthAddressInput = ({ label, onRecipientChange, onRawInputChange }: EthAddressInputProps) => {
  const [isValidToAddress, setIsValidToAddress] = useState<boolean>(false)
  const [rawTokenAddress, setRawTokenAddress] = useState<string>('')
  let name

  try {
    name = normalize(rawTokenAddress)
  } catch (e) {
    console.error(e)
  }
  const { data: ensAddy } = useEnsAddress({
    name: name,
    config: config,
  })

  const { data: ensAvatar } = useEnsAvatar({
    name: name,
    config: config,
  })

  const handleToAdressInput = (_to: string) => {
    const isValid = isAddress(_to)
    setIsValidToAddress(isValid)

    onRecipientChange(_to, isValid)
    setRawTokenAddress(_to)
    if (onRawInputChange) {
      onRawInputChange(_to)
    }
  }

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
      <div className='label py-2'>
        <span className='label-text'>{label}</span>
      </div>
      <div className='relative flex flex-col gap-2'>
        <Input
          type='text'
          placeholder='0x...'
          className={`w-full max-w-xs ${!isValidToAddress && rawTokenAddress && !ensAddy ? 'focus-visible:ring-red-400 ' : isValidToAddress ? 'focus-visible:ring-green-300' : ''}`}
          value={rawTokenAddress}
          onChange={(e) => handleToAdressInput(e.target.value)}
        />
        {ensAddy ? (
          <>
            {' '}
            <Separator />
            <button
              onClick={() => {
                setRawTokenAddress(ensAddy ?? '')
                setIsValidToAddress(true)
              }}
              className={`flex flex-row relative z-40 w-full max-w-[240px] justify-between px-4 py-2 rounded shadow-lg bg-gray-50 text-black items-center hover:cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105`}>
              <Image
                width={320}
                height={320}
                content='responsive'
                src={ensAvatar ?? ''}
                alt='avatar'
                placeholder='blur'
                blurDataURL='/assets/icons/ethereum.png'
                className={`${ensAvatar ? 'block' : 'hidden'} rounded-full min-w-8 min-h-8 w-8 h-8 object-cover relative`}
              />
              <span>{truncateAddress(ensAddy ?? '')}</span>
            </button>
          </>
        ) : null}
      </div>
    </label>
  )
}
