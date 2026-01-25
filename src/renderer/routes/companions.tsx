import { createFileRoute } from '@tanstack/react-router'
import { Box, Flex, Text, SimpleGrid, AspectRatio, Badge, ActionIcon, Stack } from '@mantine/core'
import { IconMessageCircle, IconWaveSine, IconMenu2 } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export const Route = createFileRoute('/companions')({
  component: CompanionsPage,
})

function CompanionsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('伙伴')

  const companions = [
    {
      name: 'Mika',
      desc: 'Free spirit, loyal friend',
      image: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=A%20anime%20style%20girl%2C%20short%20black%20hair%2C%20wearing%20a%20jacket%2C%20dark%20background%20with%20stars%2C%20free%20spirit%20vibe&image_size=portrait_4_3',
      is18Plus: true,
    },
    {
      name: 'Ani',
      desc: 'Sweet vibe with a nerdy heart',
      image: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=A%20anime%20style%20girl%2C%20blonde%20twin%20tails%2C%20wearing%20a%20dark%20gothic%20dress%2C%20pink%20lighting%20background%2C%20sweet%20vibe&image_size=portrait_4_3',
      is18Plus: true,
    },
    {
      name: 'Valentine',
      desc: '优雅、神秘、自带迷人气场',
      image: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=A%20anime%20style%20handsome%20man%2C%20dark%20hair%2C%20wearing%20a%20suit%2C%20elegant%20and%20mysterious%2C%20dark%20background&image_size=portrait_4_3',
      is18Plus: true,
    },
    {
      name: 'Good Rudi',
      desc: "Adventurous kids' storyteller",
      image: 'https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=A%20cute%203D%20cartoon%20style%20red%20panda%2C%20wearing%20a%20red%20hoodie%2C%20sunny%20park%20background%2C%20adventurous&image_size=portrait_4_3',
      is18Plus: false,
    },
  ]

  return (
    <Box mih="100vh" pb={80}>
      {/* Top Bar */}
      <Flex align="center" justify="space-between" px="md" py="sm" pt="max(env(safe-area-inset-top), 20px)">
        <IconMenu2 />
      </Flex>

      {/* Grid */}
      <SimpleGrid cols={2} spacing="md" p="md">
        {companions.map((c, index) => (
          <Box
            key={index}
            style={{
              borderRadius: 24,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#2C2C2E',
            }}
          >
            <AspectRatio ratio={3 / 4.5}>
              <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </AspectRatio>

            {/* Gradient Overlay */}
            <Box
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                top: '40%',
                background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8) 50%, rgba(0,0,0,1))',
              }}
            />

            {/* 18+ Badge */}
            {c.is18Plus && (
              <Box style={{ position: 'absolute', top: 12, left: 12 }}>
                <Badge 
                  variant="filled" 
                  size="sm" 
                  radius="xl"
                  styles={{ root: { backgroundColor: 'rgba(30,30,30,0.6)', color: 'white', height: 24, paddingLeft: 8, paddingRight: 8, backdropFilter: 'blur(4px)' } }}
                >
                  18+
                </Badge>
              </Box>
            )}

            {/* Content */}
            <Stack
              gap={4}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 12,
              }}
            >
              <Text c="white" fw={700} size="xl" lh={1.2} ta="center">
                {c.name}
              </Text>
              <Text c="gray.4" size="xs" lineClamp={2} lh={1.3} ta="center" mb={4}>
                {c.desc}
              </Text>

              <Flex gap="sm" mt={4}>
                <ActionIcon 
                  variant="filled" 
                  radius="xl" 
                  size={42} 
                  flex={1} 
                  bg="rgba(255,255,255,0.2)"
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <IconMessageCircle size={22} color="white" stroke={1.5} />
                </ActionIcon>
                <ActionIcon 
                  variant="filled" 
                  radius="xl" 
                  size={42} 
                  flex={1}
                  bg="white"
                >
                  <IconWaveSine size={22} color="black" stroke={1.5} />
                </ActionIcon>
              </Flex>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}
