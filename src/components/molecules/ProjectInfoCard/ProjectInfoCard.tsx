/* eslint-disable max-lines-per-function */
import React, { FC, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDirectUnknownResource } from 'hooks/useDirectUnknownResource'
import { usePermissions } from 'hooks/usePermissions'
import { DeleteModal, Spacer } from 'components/atoms'
import { Typography, Flex, Spin, Button } from 'antd'
import { TMarketPlacePanelResponse } from 'localTypes/marketplace'
import { MarketplaceCard } from 'components/molecules'
import { DropdownActions, DropdownAccessGroups } from './molecules'
import { Styled } from './styled'

export type TProjectInfoCardProps = {
  clusterName?: string
  namespace?: string
  baseApiGroup: string
  baseApiVersion: string
  baseProjectVersion: string
  projectResourceName: string
  mpResourceName: string
  baseprefix?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any
}

export const ProjectInfoCard: FC<TProjectInfoCardProps> = ({
  clusterName,
  namespace,
  baseApiGroup,
  baseApiVersion,
  baseProjectVersion,
  mpResourceName,
  projectResourceName,
  baseprefix,
  children,
}) => {
  const navigate = useNavigate()

  const {
    data: marketplacePanels,
    isLoading: marketplaceIsLoading,
    // error: marketplaceError,
  } = useDirectUnknownResource<TMarketPlacePanelResponse>({
    uri: `/api/clusters/${clusterName}/k8s/apis/${baseApiGroup}/${baseApiVersion}/${mpResourceName}/`,
    refetchInterval: 5000,
    queryKey: ['marketplacePanels', clusterName || 'no-cluster'],
    isEnabled: clusterName !== undefined,
  })

  const {
    data: project,
    isLoading,
    error,
  } = useDirectUnknownResource<{
    apiVersion: string
    kind: 'Project'
    metadata: {
      labels: {
        paas: string
        pj: string
      }
      name: string
      resourceVersion: string
      uid: string
    }
    spec: {
      businessName?: string
      description: string
      prefix: string
    }
    status: {
      conditions: {
        lastTransitionTime: string
        message: string
        reason: string
        status: string
        type: string
      }[]
    }
  }>({
    uri: `/api/clusters/${clusterName}/k8s/apis/${baseApiGroup}/${baseProjectVersion}/${projectResourceName}/${namespace}`,
    refetchInterval: 5000,
    queryKey: ['projects', clusterName || 'no-cluster'],
    isEnabled: clusterName !== undefined,
  })

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const updatePermission = usePermissions({
    apiGroup: baseApiGroup,
    typeName: projectResourceName,
    namespace: '',
    clusterName: clusterName || '',
    verb: 'update',
    refetchInterval: false,
  })

  const deletePermission = usePermissions({
    apiGroup: baseApiGroup,
    typeName: projectResourceName,
    namespace: '',
    clusterName: clusterName || '',
    verb: 'delete',
    refetchInterval: false,
  })

  const openUpdate = useCallback(() => {
    navigate(
      `${baseprefix}/${clusterName}/forms/apis/${baseApiGroup}/${baseProjectVersion}/${projectResourceName}/${namespace}?backlink=${baseprefix}/clusters/${clusterName}`,
    )
  }, [baseprefix, clusterName, namespace, baseApiGroup, baseProjectVersion, projectResourceName, navigate])

  if (isLoading) {
    return <Spin />
  }

  if (!project || error) {
    return null
  }

  const readyCondition = project.status.conditions.find(({ type }) => type === 'Ready')

  return (
    <>
      <Flex justify="space-between">
        <div>
          <Flex gap={20} vertical>
            <div>
              <Typography.Text type="secondary">Project Business Name</Typography.Text>
            </div>
            <div>
              <Flex gap="small">
                <Styled.BigValue>{project.spec.businessName || '-'}</Styled.BigValue>
                {readyCondition && (
                  <Flex align="center" gap="small">
                    <Typography.Text type={readyCondition.status === 'True' ? 'success' : 'warning'}>
                      {readyCondition.reason}
                    </Typography.Text>
                  </Flex>
                )}
              </Flex>
            </div>
            <div>
              <Typography.Text>{project.spec.description}</Typography.Text>
            </div>
          </Flex>
          {children}
          <Spacer $space={24} $samespace />
          <Flex gap={14} vertical>
            <div>
              <Typography.Text type="secondary">Developer Instruments</Typography.Text>
            </div>
            <div>
              <Flex gap={14} wrap>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
                <Button type="link">Test</Button>
              </Flex>
            </div>
          </Flex>
        </div>
        <div>
          <Flex gap={24} vertical>
            <Flex justify="flex-end">
              {readyCondition?.status === 'True' &&
              (updatePermission.data?.status.allowed || deletePermission.data?.status.allowed) ? (
                <DropdownActions
                  onDelete={
                    deletePermission.data?.status.allowed
                      ? () => {
                          setIsDeleteModalOpen(true)
                        }
                      : undefined
                  }
                  onUpdate={updatePermission.data?.status.allowed ? openUpdate : undefined}
                />
              ) : (
                <Styled.ActionMenuPlaceholder />
              )}
            </Flex>
            <DropdownAccessGroups />
          </Flex>
        </div>
      </Flex>
      <Spacer $space={24} $samespace />
      <Typography.Text type="secondary">Added Products</Typography.Text>
      <Spacer $space={12} $samespace />
      <Flex gap={22} wrap>
        {marketplaceIsLoading && <Spin />}
        {clusterName &&
          namespace &&
          marketplacePanels?.items
            .map(({ spec }) => spec)
            .sort()
            .map(({ name, description, icon, type, pathToNav, typeName, apiGroup, apiVersion, tags, disabled }) => (
              <MarketplaceCard
                baseprefix={baseprefix}
                key={name}
                description={description}
                disabled={disabled}
                icon={icon}
                isEditMode={false}
                name={name}
                clusterName={clusterName}
                namespace={namespace}
                type={type}
                pathToNav={pathToNav}
                typeName={typeName}
                apiGroup={apiGroup}
                apiVersion={apiVersion}
                tags={tags}
                addedMode
              />
            ))}
      </Flex>
      {isDeleteModalOpen && (
        <DeleteModal
          name={project.metadata.name}
          onClose={() => {
            setIsDeleteModalOpen(false)
            navigate(`${baseprefix}/clusters/${clusterName}`)
          }}
          endpoint={`/api/clusters/${clusterName}/k8s/apis/${baseApiGroup}/${baseProjectVersion}/${projectResourceName}/${project.metadata.name}`}
        />
      )}
    </>
  )
}
