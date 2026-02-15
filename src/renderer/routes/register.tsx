import { Box, Button, Checkbox, Flex, PasswordInput, Stack, Text, TextInput, Anchor } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { registerUser, useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleRegister = async () => {
    if (!agreed) {
      setError('请先同意用户协议和隐私政策')
      return
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    setError('')
    setSubmitting(true)
    const result = await registerUser(email, password, nickname || undefined)
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
      <Flex justify="center" align="center" mb={40} pt="max(env(safe-area-inset-top), 0px)">
        <Text size="sm" fw={500}>
          注册
        </Text>
      </Flex>

      <Stack gap={4} mb={40}>
        <Text size="2rem" fw={700}>
          创建账号
        </Text>
        <Text c="dimmed" size="sm">
          注册后即可开始使用
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
        <TextInput
          size="lg"
          radius="md"
          placeholder="昵称（选填）"
          value={nickname}
          onChange={(e) => setNickname(e.currentTarget.value)}
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
          placeholder="设置密码（至少6位）"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
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
          placeholder="确认密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
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
        onClick={handleRegister}
        styles={{
          root: {
            background: 'linear-gradient(90deg, #E0CBA8 0%, #D4AF37 100%)',
            color: 'black',
            fontWeight: 600,
          },
        }}
        mb="md"
      >
        注册
      </Button>

      <Flex align="center" justify="center" mb="md">
        <Text size="sm" c="dimmed">
          已有账号？
        </Text>
        <Anchor size="sm" ml={4} onClick={() => navigate({ to: '/login' })}>
          去登录
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
