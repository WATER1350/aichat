import { ActionIcon, Anchor, Box, Button, Checkbox, Flex, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { loginUser, useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    if (!agreed) {
      setError('请先同意用户协议和隐私政策')
      return
    }
    setError('')
    setSubmitting(true)
    const result = await loginUser(email, password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else if (result.user) {
      setUser(result.user)
      navigate({ to: '/' })
    }
  }

  return (
    <Box mih="100vh" bg="var(--mantine-color-body)" p="md">
      <Flex justify="space-between" align="center" mb={40} pt="max(env(safe-area-inset-top), 0px)">
        <ActionIcon variant="subtle" color="gray" onClick={() => navigate({ to: '/' })}>
          <IconArrowLeft />
        </ActionIcon>
        <Text size="sm" fw={500}>
          登录
        </Text>
        <Box w={28} />
      </Flex>

      <Stack gap={4} mb={40}>
        <Text size="2rem" fw={700}>
          欢迎回来
        </Text>
        <Text c="dimmed" size="sm">
          使用邮箱和密码登录
        </Text>
      </Stack>

      <Stack gap="md" mb={40}>
        <TextInput
          size="lg"
          radius="md"
          placeholder="输入邮箱地址"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-default)',
              border: 'none',
            },
          }}
        />
        <PasswordInput
          size="lg"
          radius="md"
          placeholder="输入密码"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-default)',
              border: 'none',
            },
          }}
        />
      </Stack>

      {error && (
        <Text c="red" size="sm" mb="md">
          {error}
        </Text>
      )}

      <Button
        fullWidth
        size="lg"
        radius="xl"
        loading={submitting}
        onClick={handleLogin}
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

      <Flex align="center" justify="center" mb="md">
        <Text size="sm" c="dimmed">
          还没有账号？
        </Text>
        <Anchor size="sm" ml={4} onClick={() => navigate({ to: '/register' })}>
          立即注册
        </Anchor>
      </Flex>

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
