import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { SuccessIcon } from './SuccessIcon'

const defaultFeedbackIcons = {
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  validating: <LoadingOutlined />,
}

export const feedbackIcons = () => ({
  ...defaultFeedbackIcons,
  success: <SuccessIcon />,
})
