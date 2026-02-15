import { ActionIcon, Box, Button, Checkbox, Flex, Stack, Text, TextInput } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [agreed, setAgreed] = useState(false)

  return (
    <Box mih="100vh" bg="var(--mantine-color-body)" p="md">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={40} pt="max(env(safe-area-inset-top), 0px)">
        <ActionIcon variant="subtle" color="gray" onClick={() => navigate({ to: '..' })}>
          <IconX />
        </ActionIcon>
        <Text size="sm" fw={500}>
          密码登录
        </Text>
      </Flex>

      {/* Title */}
      <Stack gap={4} mb={40}>
        <Text size="2rem" fw={700}>
          欢迎登录 念念
        </Text>
        <Text c="dimmed" size="sm">
          未注册的手机号验证通过后将自动注册
        </Text>
      </Stack>

      {/* Form */}
      <Stack gap="md" mb={40}>
        <TextInput
          size="lg"
          radius="md"
          placeholder="输入手机号码"
          leftSection={
            <Text c="dimmed" size="sm" pl={4}>
              +86
            </Text>
          }
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-default)',
              border: 'none',
            },
          }}
        />
        <TextInput
          size="lg"
          radius="md"
          placeholder="输入验证码"
          rightSectionWidth={100}
          rightSection={
            <Button variant="subtle" c="dimmed" size="xs" radius="md">
              获取验证码
            </Button>
          }
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-default)',
              border: 'none',
            },
          }}
        />
      </Stack>

      {/* Submit Button */}
      <Button
        fullWidth
        size="lg"
        radius="xl"
        styles={{
          root: {
            background: 'linear-gradient(90deg, #E0CBA8 0%, #D4AF37 100%)',
            color: 'black',
            fontWeight: 600,
          },
        }}
        mb="md"
      >
        确认登录
      </Button>

      {/* Agreement */}
      <Flex align="center" gap="xs">
        <Checkbox
          checked={agreed}
          onChange={(event) => setAgreed(event.currentTarget.checked)}
          color="gray"
          radius="xl"
          size="xs"
          styles={{ input: { borderColor: 'var(--mantine-color-dimmed)' } }}
        />
        <Text size="xs" c="dimmed">
          已阅读并同意
          <Text span c="dimmed" td="underline" mx={2}>
            《用户协议》
          </Text>
          <Text span c="dimmed" td="underline">
            《隐私政策》
          </Text>
        </Text>
      </Flex>
    </Box>
  )
}
